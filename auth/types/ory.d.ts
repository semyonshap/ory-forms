export {}

declare module '@ory-forms/react' {
  interface OryProject {
    brand_primary?: string
    captcha_enabled: boolean
    turnstile_site_key?: string
  }
}
