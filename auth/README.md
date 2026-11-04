## 🔧 Configuration via Environment Variables

---

### 🌐 Branding

- `PROJECT_TRANSLATIONS` – JSON with translations (default: `{}`)
- `PROJECT_DEFAULT_LOCALE` – Default language (default: `en`)
- `PROJECT_ENABLED_LOCALES` – Comma-separated list of enabled locales (required)
- `PROJECT_LOCALE_BEHAVIOR` – `force_default` or `respect_accept_language` (default: `force_default`)
- `PROJECT_NAME` – Project name (default: `Ory`)
- `PROJECT_LOGO_URL` – Logo URL (optional)
- `BRAND_PRIMARY` – Primary brand color (optional)

---

### 🛡 Captcha (Turnstile)

- `CAPTCHA_ENABLED` – Enable captcha (default: `false`)
- `TURNSTILE_SITE_KEY` – Turnstile site key (dev default: `1x00000000000000000000AA`)
- `TURNSTILE_SECRET` – Turnstile secret key (dev default: `1x00000000000000000000AA`)

---

### 🔐 Keto Integration

- `KETO_READ_URL` – Keto read API URL (required)
- `KETO_NAMESPACE` – Relationship namespace, e.g. `Group`
- `KETO_RELATION` – Relationship type, e.g. `members`

---

### 📡 Webhook secure

- `WEBHOOK_KEY` – HTTP header name for authentication, e.g. `x-webhook-secret`
- `WEBHOOK_SECRET_KEY` – Secret value for the header
