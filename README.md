# @ory-forms

A monorepo for building authentication forms powered by [Ory](https://www.ory.sh/). Provides React components and Next.js utilities to integrate Ory Kratos authentication flows (login, registration, recovery, verification, settings, OAuth2 consent).

## Packages

| Package             | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `@ory-forms/react`  | React components and hooks for Ory identity flows                |
| `@ory-forms/nextjs` | Next.js server utilities, middleware, and route handlers for Ory |

## Getting Started

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Build a specific package
npm run build:react
npm run build:nextjs
```

## Development

```bash
# Lint all packages
npm run lint

# Format code
npm run format
```

## Auth App

The `auth/` directory contains a Next.js app demonstrating Ory authentication flows with login, registration, recovery, verification, OAuth2 consent, and settings pages.
