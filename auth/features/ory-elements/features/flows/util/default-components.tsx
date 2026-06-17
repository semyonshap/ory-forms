// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFlowComponentOverrides,
  OryFlowComponents,
} from "@/features/ory-elements"
import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
} from "../../card/ui"
import { DefaultAuthMethodListItem } from "../../card/ui/auth-method-list-item"
import {
  DefaultFormContainer,
  DefaultMessage,
  DefaultMessageContainer,
} from "../../form/ui"
import { DefaultButton } from "../../form/ui/button"
import { DefaultCheckbox } from "../../form/ui/checkbox"
import { DefaultGroupContainer } from "../../form/ui/group-container"
import { Separator } from "@/components/ui/separator"
import { DefaultImage } from "../../form/ui/image"
import { DefaultInput } from "../../form/ui/input"
import { DefaultLabel } from "../../form/ui/label"
import { DefaultLinkButton } from "../../form/ui/link-button"
import { DefaultPinCodeInput } from "../../form/ui/pin-code-input"
import {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
} from "../../form/ui/section"
import { DefaultButtonSocial, DefaultSocialButtonContainer } from "../../form/ui/sso"
import { DefaultText } from "../../form/ui/text"
import { DefaultPageHeader } from "../../../shared/ui/page-header"
import { DefaultSettingsOidc } from "../../settings/ui/settings-oidc"
import { DefaultSettingsPasskey } from "../../settings/ui/settings-passkey"
import { DefaultSettingsRecoveryCodes } from "../../settings/ui/settings-recovery-codes"
import { DefaultSettingsTotp } from "../../settings/ui/settings-totp"
import { DefaultSettingsWebauthn } from "../../settings/ui/settings-webauthn"
import { DefaultAuthMethodListContainer } from "../../card/ui/auth-method-list-container"
import { DefaultCaptcha } from "../../form/ui/captcha"
import { DefaultConsentScopeCheckbox } from "../../form/ui/consent-scope-checkbox"
import { DefaultToast } from "../../../shared/ui/toast"

/**
 * Merges the default Ory components with any provided overrides.
 *
 * The output of this function is a complete set of components that can be used in Ory flows.
 *
 * @param overrides - Optional overrides for the default components.
 * @returns
 *
 * @category Utilities
 */
export function getOryComponents(
  overrides?: OryFlowComponentOverrides,
): OryFlowComponents {
  // Yes, this could probably be easier by using lodash or a custom merge function.
  // But, this makes it very explicit what can be overridden, and does not introduce issues with merging nested fields.
  return {
    Card: {
      Root: overrides?.Card?.Root ?? DefaultCard,
      Footer: overrides?.Card?.Footer ?? DefaultCardFooter,
      Header: overrides?.Card?.Header ?? DefaultCardHeader,
      Content: overrides?.Card?.Content ?? DefaultCardContent,
      Logo: overrides?.Card?.Logo ?? DefaultCardLogo,
      Divider: overrides?.Card?.Divider ?? Separator,
      AuthMethodListContainer:
        overrides?.Card?.AuthMethodListContainer ??
        DefaultAuthMethodListContainer,
      AuthMethodListItem:
        overrides?.Card?.AuthMethodListItem ?? DefaultAuthMethodListItem,
      SettingsSection: overrides?.Card?.SettingsSection ?? DefaultFormSection,
      SettingsSectionContent:
        overrides?.Card?.SettingsSectionContent ?? DefaultFormSectionContent,
      SettingsSectionFooter:
        overrides?.Card?.SettingsSectionFooter ?? DefaultFormSectionFooter,
    },
    Node: {
      Button: overrides?.Node?.Button ?? DefaultButton,
      SsoButton: overrides?.Node?.SsoButton ?? DefaultButtonSocial,
      Input: overrides?.Node?.Input ?? DefaultInput,
      CodeInput: overrides?.Node?.CodeInput ?? DefaultPinCodeInput,
      Image: overrides?.Node?.Image ?? DefaultImage,
      Label: overrides?.Node?.Label ?? DefaultLabel,
      Checkbox: overrides?.Node?.Checkbox ?? DefaultCheckbox,
      Text: overrides?.Node?.Text ?? DefaultText,
      Anchor: overrides?.Node?.Anchor ?? DefaultLinkButton,
      Captcha: overrides?.Node?.Captcha ?? DefaultCaptcha,
      ConsentScopeCheckbox:
        overrides?.Node?.ConsentScopeCheckbox ?? DefaultConsentScopeCheckbox,
    },
    Form: {
      Root: overrides?.Form?.Root ?? DefaultFormContainer,
      Group: overrides?.Form?.Group ?? DefaultGroupContainer,
      SsoRoot: overrides?.Form?.SsoRoot ?? DefaultSocialButtonContainer,
      RecoveryCodesSettings:
        overrides?.Form?.RecoveryCodesSettings ?? DefaultSettingsRecoveryCodes,
      TotpSettings: overrides?.Form?.TotpSettings ?? DefaultSettingsTotp,
      SsoSettings: overrides?.Form?.SsoSettings ?? DefaultSettingsOidc,
      WebauthnSettings:
        overrides?.Form?.WebauthnSettings ?? DefaultSettingsWebauthn,
      PasskeySettings:
        overrides?.Form?.PasskeySettings ?? DefaultSettingsPasskey,
    },
    Message: {
      Root: overrides?.Message?.Root ?? DefaultMessageContainer,
      Content: overrides?.Message?.Content ?? DefaultMessage,
      Toast: overrides?.Message?.Toast ?? DefaultToast,
    },
    Page: {
      Header: overrides?.Page?.Header ?? DefaultPageHeader,
    },
  }
}
