import { TFunction } from "i18next"

const scopeMessages: Record<string, { title: string; description: string }> = {
  openid: {
    title: "consent.scope.openid.title",
    description: "consent.scope.openid.description",
  },
  offline_access: {
    title: "consent.scope.offline_access.title",
    description: "consent.scope.offline_access.description",
  },
  profile: {
    title: "consent.scope.profile.title",
    description: "consent.scope.profile.description",
  },
  email: {
    title: "consent.scope.email.title",
    description: "consent.scope.email.description",
  },
  address: {
    title: "consent.scope.address.title",
    description: "consent.scope.address.description",
  },
  phone: {
    title: "consent.scope.phone.title",
    description: "consent.scope.phone.description",
  },
}

export function getScopeHeader(
  scope: string,
  t: TFunction,
): { title: string; description: string } {
  const keys = scopeMessages[scope] ?? {
    title: `consent.scope.${scope}.title`,
    description: `consent.scope.${scope}.description`,
  }

  return {
    title: t(keys.title, { defaultValue: scope }),
    description: t(keys.description, { defaultValue: "" }),
  }
}
