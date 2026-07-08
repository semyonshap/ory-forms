import { oryConfig } from "@/ory.config"
import { createOryMiddleware } from "@/features/ory-nextjs/middleware"

export const middleware = createOryMiddleware(oryConfig)

export const config = {}
