FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.17.0 --activate
WORKDIR /app

ARG ENV_FILE
ENV ENV_FILE=$ENV_FILE

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:22-alpine
WORKDIR /app

ENV PORT=8080
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER node

COPY --from=base --chown=node:node /app/auth/.next/standalone ./
COPY --from=base --chown=node:node /app/auth/.next/static ./auth/.next/static
COPY --from=base --chown=node:node /app/auth/public ./auth/public

EXPOSE 8080

CMD ["node", "auth/server.js"]