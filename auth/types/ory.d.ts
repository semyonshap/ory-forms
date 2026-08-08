export {}

declare module '@ory-forms/react' {
  interface OryProject {
    captcha_enabled: boolean
    brand_primary?: string
    turnstile_site_key?: string
    force_cookie_domain?: string
  }
}
