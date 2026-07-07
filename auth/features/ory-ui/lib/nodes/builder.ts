import {
  BuildContext,
  FormNode,
  FormStateAction,
  GroupSorter,
  InputNodeData,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeText,
  NodeSorter,
  OryFlowType,
  UiNodeInput,
  UiNodeText,
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
  BuildDivider,
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
import {
  createDivGroup,
  createInputNode,
  createTextNode,
  createUiText,
} from "./factory"
import { getFunctionalNodes, toAuthMethodPickerOptions } from "./filters"
import { computeDataBuilder } from "./data"

export function Builder({
  config,
  flowContainer,
  formState,
  t,
  dispatchFormState,
  nodeSorter,
  groupSorter,
}: BuildContext & {
  dispatchFormState: Dispatch<FormStateAction>
  nodeSorter: NodeSorter
  groupSorter: GroupSorter
}) {
  const ctx: BuildContext = {
    config,
    flowContainer,
    formState,
    t,
  }

  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })
  const sortGroups = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) =>
    groupSorter(a, b)

  const { flow, flowType } = flowContainer

  const nodes = computeDataBuilder([...flow.ui.nodes])

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
          result.push(BuildDivider())
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

      const methodsWithDivider =
        methodButtons.length > 0 ? [BuildDivider(), ...methodButtons] : []

      result = [
        ...authMethodAdditionalNodes,
        ...ssoNodes,
        ...methodsWithDivider,
        ...hiddenNodes,
      ]
      break
    }
    case "settings": {
      result = Object.values(UiNodeGroupEnum)
        .sort(sortGroups)
        .flatMap((group) => {
          const children = visibleGroups[group]
          if (!children) return []

          let keyFooter

          switch (group) {
            case UiNodeGroupEnum.Totp: {
              const unlink = children.find(
                (n) => isUiNodeInput(n) && n.attributes.name === "totp_unlink",
              )

              keyFooter = unlink
                ? "settings.totp.info.linked"
                : "settings.totp.info.not-linked"

              const secretKeyText = children.find(
                (n): n is UiNodeText =>
                  isUiNodeText(n) && n.attributes.id === "totp_secret_key",
              )
              const secretQr = children.find(
                (n) => isUiNodeImage(n) && n.attributes.id === "totp_qr",
              )
              const secretCode = children.find(
                (n): n is UiNodeInput =>
                  isUiNodeInput(n) && n.attributes.name === "totp_code",
              )

              if (secretKeyText && secretQr && secretCode) {
                const secretKeyInput = createInputNode({
                  group,
                  attributes: {
                    name: "totp_secret_key",
                    type: "text",
                    disabled: false,
                    value: secretKeyText.attributes.text?.text,
                    label: createUiText({
                      keyOrId: 1050017,
                      text: "Authenticator Secret",
                      t,
                    }),
                  },
                })

                const secretRightGroup = createDivGroup({
                  id: `${group}-secret-right-div`,
                  class: "w-full flex flex-col gap-2",
                  div_type: "Div",
                  children: [secretKeyInput, secretCode],
                })

                const secretGroup = createDivGroup({
                  id: `${group}-secret-div`,
                  class: "flex flex-row gap-4",
                  div_type: "Div",
                  children: [secretQr, ...secretRightGroup],
                })

                children.splice(children.indexOf(secretCode), 1)
                children.splice(children.indexOf(secretKeyText), 1)
                children.splice(children.indexOf(secretQr), 1, ...secretGroup)
              }
              break
            }
            case UiNodeGroupEnum.Oidc:
              keyFooter = `settings.${group}.info`
              children.forEach((n) => {
                if (isUiNodeInput(n) && n.attributes.type === "submit") {
                  const data: InputNodeData = {
                    type: "oidc",
                  }
                  n.data = { ...n.data, ...data }
                }
              })
              break
            case UiNodeGroupEnum.Passkey:
            case UiNodeGroupEnum.Webauthn: {
              keyFooter = `settings.${group}.info`
              break
            }
            case UiNodeGroupEnum.LookupSecret: {
              const codesNode = children.find(
                (n): n is UiNodeText =>
                  isUiNodeText(n) && n.attributes.id === "lookup_secret_codes",
              )

              if (codesNode) {
                const ctx = codesNode.attributes.text.context as Record<
                  string,
                  unknown
                >

                const secrets: string[] = Array.isArray(ctx?.secrets)
                  ? ctx.secrets.map((i: Record<string, unknown>) =>
                      String(i.text ?? ""),
                    )
                  : []

                const codeNodes = secrets.map((code) =>
                  createInputNode({
                    group,
                    attributes: {
                      name: code,
                      type: "text",
                      disabled: false,
                      value: code,
                    },
                  }),
                )

                const codesDiv = createDivGroup({
                  id: `${group}-codes`,
                  class: "grid grid-cols-3 gap-2",
                  div_type: "Div",
                  children: codeNodes,
                })

                children.splice(children.indexOf(codesNode), 1, ...codesDiv)
              }
              break
            }
          }

          let footerChildren: UiNode[] = []

          if (keyFooter) {
            const textNode = createTextNode({
              id: `${group}-footer-description`,
              text: createUiText({
                keyOrId: keyFooter,
                text: "",
                t,
              }),
            })
            footerChildren.push(textNode)
          }

          const submitIds = [1070003, 1050008, 1050011, 1050016, 1050007]

          for (let i = children.length - 1; i >= 0; i--) {
            const n = children[i]
            const id = n.meta.label?.id
            if (
              isUiNodeInput(n) &&
              n.attributes.type === "submit" &&
              id &&
              submitIds.includes(id)
            ) {
              if (n.meta.label?.id === 1050016) {
                n.data = { ...n.data, inputType: "cancel" }
              }
              footerChildren.push(children.splice(i, 1)[0])
            }
          }

          const footerJustify =
            footerChildren.length === 1 && footerChildren[0].type === "text"
              ? "justify-start"
              : "justify-end"

          const submitGroup = createDivGroup({
            id: `${group}-footer`,
            div_type: "Div",
            class: `flex ${footerJustify} gap-4 mt-2`,
            children: footerChildren,
          })

          children.push(...submitGroup)

          return createDivGroup({
            id: `${group}-card`,
            div_type: "SettingsCard",
            children,
            group,
          })
        })
      break
    }
  }

  if (flowType !== OryFlowType.Settings) {
    result = createDivGroup({
      id: "form-card",
      div_type: "FormCard",
      children: result,
    })
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
