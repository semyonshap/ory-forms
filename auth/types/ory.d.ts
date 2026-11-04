export {}

declare module '@ory-forms/react' {
  interface OryProject {
    logo_url?: string
    brand_primary?: string
    captcha_enabled: boolean
    turnstile_site_key?: string
  }
}
