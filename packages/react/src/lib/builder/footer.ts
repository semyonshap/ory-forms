import { UiNodeGroupEnum } from '@ory/client-fetch'

import { groupNodes } from '../nodes/groups'
import { findScreenSelectionButton } from '../nodes/filters'
import {
  BuildSelectMethod,
  BuildGoBackCode,
  BuildSignUp,
  BuildSignIn,
  BuildRecover,
  BuildForgotPassword,
} from '../nodes/presets'
import {
  BuildContext,
  FormNode,
  isUiNodeInput,
  OryFlowType,
  excludedAuthGroups,
} from '../../types'

export function buildFooter(
  ctx: BuildContext,
  authMethodBlocks: UiNodeGroupEnum[],
): FormNode[] {
  const { flowContainer, formState, config } = ctx
  const { flow, flowType } = flowContainer
  const { registration_enabled, hide_registration_link } = config.project

  const { groups: authMethods } = groupNodes({
    nodes: flow.ui.nodes,
    excludeGroups: excludedAuthGroups,
    excludeHidden: false,
  })

  const stateActive = formState.current

  const result: FormNode[] = []

  switch (flowType) {
    case OryFlowType.Login: {
      if (!flow.refresh) {
        const identifierNode = flow.ui.nodes
          .filter(isUiNodeInput)
          .find((n) => n.attributes.name === 'identifier')

        if (identifierNode) {
          result.push(
            BuildRecover({
              ...ctx,
              target: identifierNode.attributes.name,
            }),
          )
        } else {
          const passwordNode = flow.ui.nodes
            .filter(isUiNodeInput)
            .find((n) => n.attributes.type === 'password')

          if (passwordNode) {
            result.push(
              BuildForgotPassword({
                ...ctx,
                target: passwordNode.attributes.name,
              }),
            )
          }
        }
      }

      if (stateActive === 'method_active') {
        if (authMethods.length > 1) {
          result.push(BuildSelectMethod(ctx))
        } else if (flow.active === 'code') {
          result.push(BuildGoBackCode(ctx))
        }
      } else if (
        stateActive === 'provide_identifier' &&
        registration_enabled &&
        !hide_registration_link
      ) {
        result.push(...BuildSignUp(ctx))
      }

      break
    }
    case OryFlowType.Registration: {
      if (stateActive === 'method_active') {
        const screenSelectionNode = findScreenSelectionButton(
          flow.ui.nodes,
        )
        if (screenSelectionNode && authMethodBlocks.length >= 2) {
          result.push(BuildSelectMethod(ctx))
        }
      } else if (registration_enabled) {
        result.push(...BuildSignIn(ctx))
      }
      break
    }
  }

  return result
}
