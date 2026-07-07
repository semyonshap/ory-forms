import {
  BuildContext,
  FormNode,
  FormStateAction,
  NodeSorter,
  OryFlowType,
} from "../../types"
import { BuildLogout, showLogout } from "./logout"
import {
  BuildChooseMethod,
  BuildForgotPassword,
  BuildSelectAnother as BuildSelectMethod,
  BuildGoBackCode,
  BuildRecover,
  BuildSignIn,
  BuildSignUp,
} from "./presets"
import { BuildAuthMethodList } from "./authMethods"
import {
  getFinalNodes,
  getNodeGroupsWithVisibleNodes,
  nodesToAuthMethodGroups,
} from "./groups"
import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { Dispatch } from "react"
import {
  findScreenSelectionButton,
  isNodeVisible,
  withoutSingleSignOnNodes,
} from "./filters"
import { createDivGroup, createDivNode } from "./factory"
import { getFunctionalNodes, toAuthMethodPickerOptions } from "./filters"
import { computeDataBuilder } from "./data"

export function Builder({
  
  config,
  container,
  formState,
  t,
  dispatchFormState,
  nodeSorter,
}: BuildContext & {
  dispatchFormState: Dispatch<FormStateAction>
  nodeSorter: NodeSorter
}) {
  const ctx: BuildContext = {
    config,
    container,
    formState,
    t,
  }
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const { flow, flowType } = container

  const nodes = computeDataBuilder([...flow.ui.nodes])

  console.log("nodes:", nodes)
  console.log("formstate:", formState)

  let result: FormNode[] = []

  const authMethods = nodesToAuthMethodGroups(nodes)
  const visibleGroups = getNodeGroupsWithVisibleNodes(nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)

  switch (formState.current) {
    case "provide_identifier": {
      const nonSsoNodes = withoutSingleSignOnNodes(nodes).sort(sortNodes)
      const ssoNodes = nodes
        .filter(isNodeVisible)
        .filter(
          (node) =>
            node.group === UiNodeGroupEnum.Oidc ||
            node.group === UiNodeGroupEnum.Saml,
        )

      if (ssoNodes.length > 0) {
        result.push(...ssoNodes)
        if (nonSsoNodes.some(isNodeVisible)) {
          result.push(
            createDivNode({
              id: "sso-divider",
              div_type: "DividerCard",
            }),
          )
        }
      }

      result.push(...nonSsoNodes)

      switch (flowType) {
        case OryFlowType.Login: {
          if (showLogout(flow, formState, authMethods)) {
            const logout = BuildLogout(ctx)
            result.push(...logout)
          } else {
            if (config.project.registration_enabled) {
              const signUp = BuildSignUp(ctx)
              result.push(...signUp)
            }
          }
          break
        }
        case OryFlowType.Registration: {
          if (config.project.registration_enabled) {
            const signIn = BuildSignIn(ctx)
            result.push(...signIn)
          }
          break
        }
      }
      break
    }
    case "method_active": {
      const finalNodes = getFinalNodes(visibleGroups, formState.method)

      result = [
        ...new Set([
          ...nodes.filter(
            (n) =>
              isUiNodeScriptAttributes(n.attributes) ||
              n.group === UiNodeGroupEnum.Default ||
              n.group === UiNodeGroupEnum.Profile,
          ),
          ...finalNodes,
        ]),
      ].sort(sortNodes)

      switch (flowType) {
        case OryFlowType.Login: {
          if (authMethods.length > 1) {
            const chooseMethod = BuildChooseMethod({
              ...ctx,
              onClick: () => {
                dispatchFormState({ type: "action_clear_active_method" })
              },
            })
            result.push(chooseMethod)
          } else if (authMethods.length === 1 && authMethods[0] === "code") {
            const goBack = BuildGoBackCode(ctx)
            result.push(goBack)
          }
        }
        case OryFlowType.Registration: {
          const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
          if (
            screenSelectionNode ||
            Object.entries(authMethodBlocks).length > 2
          ) {
            const selectMethod = BuildSelectMethod({
              ...ctx,
              onClick: () => {
                dispatchFormState({ type: "action_clear_active_method" })
              },
            })
            result.push(selectMethod)
          }
        }
      }
      break
    }
    case "select_method": {
      const authMethodAdditionalNodes =
        getFunctionalNodes(nodes).sort(sortNodes)

      const ssoNodes = nodes
        .filter(isNodeVisible)
        .filter(
          (node) =>
            node.group === UiNodeGroupEnum.Oidc ||
            node.group === UiNodeGroupEnum.Saml,
        )

      const hiddenNodes = nodes.filter(
        (n) =>
          n.group !== UiNodeGroupEnum.Captcha &&
          ((n.attributes.node_type === "input" &&
            n.attributes.type === "hidden") ||
            isUiNodeScriptAttributes(n.attributes)),
      )

      const methodButtons = BuildAuthMethodList({
        groups: authMethodBlocks,
        dispatchFormState,
        ctx,
      })

      result = [
        ...authMethodAdditionalNodes,
        ...ssoNodes,
        ...methodButtons,
        ...hiddenNodes,
      ]
      break
    }
    case "settings": {
      result = Object.entries(visibleGroups)
        .filter(([, nodes]) => nodes && nodes.length > 0)
        .flatMap(([group, nodes]) =>
          createDivGroup({
            id: `${group}-card`,
            div_type: "SettingsCard",
            children: nodes,
          }),
        )
      break
    }
  }

  switch (flowType) {
    case OryFlowType.Login: {
      if (!flow.refresh) {
        const recover = BuildRecover(ctx)
        if (recover) {
          result.push(recover)
        } else {
          const forgot = BuildForgotPassword(ctx)
          if (forgot) {
            result.push(forgot)
          }
        }
      }
    }
  }

  return result
}
