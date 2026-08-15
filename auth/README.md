## 🔧 Configuration via Environment Variables

---

### 🌐 Branding

- `NEXT_PUBLIC_PROJECT_TRANSLATIONS` – JSON with translations (default: `{}`)
- `NEXT_PUBLIC_PROJECT_DEFAULT_LOCALE` – Default language (default: `en`)
- `NEXT_PUBLIC_PROJECT_ENABLED_LOCALES` – Comma-separated list of enabled locales (required)
- `NEXT_PUBLIC_PROJECT_LOCALE_BEHAVIOR` – `force_default` or `respect_accept_language` (default: `force_default`)
- `NEXT_PUBLIC_PROJECT_NAME` – Project name (default: `Ory`)
- `NEXT_PUBLIC_PROJECT_LOGO_DARK_URL` – Logo URL for dark theme (optional)
- `NEXT_PUBLIC_PROJECT_LOGO_LIGHT_URL` – Logo URL for light theme (optional)
- `NEXT_PUBLIC_BRAND_PRIMARY` – Primary brand color (optional)
- `NEXT_PUBLIC_HIDE_REGISTRATION_LINK` – Hide the registration link (default: `false`)
- `NEXT_PUBLIC_REGISTRATION_ENABLED` – Enable user registration (default: `true`)
- `NEXT_PUBLIC_VERIFICATION_ENABLED` – Enable email verification (default: `true`)

---

### 🛡 Captcha (Turnstile)

- `NEXT_PUBLIC_CAPTCHA_ENABLED` – Enable captcha (default: `false`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` – Turnstile site key (dev default: `1x00000000000000000000AA`)
- `TURNSTILE_SECRET_KEY` – Turnstile secret key (dev default: `1x00000000000000000000AA`)

---

### 🔐 Keto Integration

- `ORY_KETO_READ_URL` – Keto read API URL (required)
- `KETO_NAMESPACE` – Relationship namespace, e.g. `Group`
- `KETO_RELATION` – Relationship type, e.g. `members`

---

### 📡 Webhook secure

- `WEBHOOK_KEY` – HTTP header name for authentication, e.g. `x-webhook-secret`
- `WEBHOOK_SECRET_KEY` – Secret value for the header

