import { TFunction } from "i18next"
import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import {
  InputNodeData,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeText,
  UiNodeInput,
  UiNodeText,
} from "../../types"
import {
  createDivGroup,
  createInputNode,
  createTextNode,
  createUiText,
} from "../nodes/factory"

export function SettingsBuilder(
  group: UiNodeGroupEnum,
  nodes: UiNode[],
  t: TFunction,
) {
  let keyFooter

  switch (group) {
    case UiNodeGroupEnum.Totp: {
      const unlink = nodes.find(
        (n) => isUiNodeInput(n) && n.attributes.name === "totp_unlink",
      )

      keyFooter = unlink
        ? "settings.totp.info.linked"
        : "settings.totp.info.not-linked"

      const secretKeyText = nodes.find(
        (n): n is UiNodeText =>
          isUiNodeText(n) && n.attributes.id === "totp_secret_key",
      )
      const secretQr = nodes.find(
        (n) => isUiNodeImage(n) && n.attributes.id === "totp_qr",
      )
      const secretCode = nodes.find(
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

        nodes.splice(nodes.indexOf(secretCode), 1)
        nodes.splice(nodes.indexOf(secretKeyText), 1)
        nodes.splice(nodes.indexOf(secretQr), 1, ...secretGroup)
      }
      break
    }
    case UiNodeGroupEnum.Oidc:
      keyFooter = `settings.${group}.info`
      nodes.forEach((n) => {
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
      const codesNode = nodes.find(
        (n): n is UiNodeText =>
          isUiNodeText(n) && n.attributes.id === "lookup_secret_codes",
      )

      if (codesNode) {
        const ctx = codesNode.attributes.text.context as Record<string, unknown>

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
            data: {
              readOnly: true,
            },
          }),
        )

        const codesDiv = createDivGroup({
          id: `${group}-codes`,
          class: "grid grid-cols-3 gap-2",
          div_type: "Div",
          children: codeNodes,
        })

        nodes.splice(nodes.indexOf(codesNode), 1, ...codesDiv)
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

  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i]
    const id = n.meta.label?.id
    if (
      isUiNodeInput(n) &&
      n.attributes.type === "submit" &&
      id &&
      submitIds.includes(id)
    ) {
      if (n.meta.label?.id === 1050016) {
        n.data = { ...n.data, variant: "cancel" }
      }
      footerChildren.push(nodes.splice(i, 1)[0])
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

  nodes.push(...submitGroup)

  return createDivGroup({
    id: `${group}-card`,
    div_type: "SettingsCard",
    children: nodes,
    group,
  })
}
