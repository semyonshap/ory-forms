// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeConsentScopeCheckboxProps } from "@/features/ory-elements"
import { User, Mail, Phone } from "lucide-react"
import { ListItem } from "../../card/ui/list-item"
import { useIntl } from "react-intl"
import { Switch } from "@/components/ui/switch"

const ScopeIcons: Record<string, typeof User> = {
  openid: User,
  offline_access: User,
  profile: User,
  email: Mail,
  phone: Phone,
}

export function DefaultConsentScopeCheckbox({
  attributes,
  onCheckedChange,
  inputProps,
}: OryNodeConsentScopeCheckboxProps) {
  const intl = useIntl()
  const Icon = ScopeIcons[attributes.value as string] ?? User
  return (
    <ListItem
      as="label"
      icon={Icon}
      title={intl.formatMessage({
        id: `consent.scope.${attributes.value}.title`,
        defaultMessage: attributes.value,
      })}
      description={intl.formatMessage({
        id: `consent.scope.${attributes.value}.description`,
        defaultMessage: [],
      })}
      className="col-span-2"
      data-testid="ory/screen/consent/scope-checkbox-label"
    >
      <Switch
        data-testid={`ory/screen/consent/scope-checkbox`}
        {...inputProps}
        onCheckedChange={onCheckedChange}
        defaultChecked={true}
      />
    </ListItem>
  )
}
