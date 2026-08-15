export {}

declare module '@ory-forms/react' {
  interface OryProject {
    brand_primary?: string

    captcha_enabled: boolean
    turnstile_site_key?: string
    turnstile_secret?: string

    webhook_key?: string
    webhook_secret_key?: string

    keto_url?: string
    keto_namespace?: string
    keto_relation?: string
  }
}
