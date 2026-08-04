.PHONY: help install build dev typecheck lint lint-fix deps format format-check clean changeset version publish start docker-build docker-start

help: ## Show this help message
	@awk '/^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "##")+3)}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

build: ## Build packages
	pnpm build

dev: ## Run Dev mode
	pnpm dev

typecheck: ## Run TypeScript type checking
	pnpm typecheck

lint: ## Run ESLint
	pnpm lint

lint-fix: ## Auto-fix ESLint issues
	pnpm lint:fix

deps: ## Check unused/missing dependencies
	pnpm deps:check

format: ## Format all files (write)
	pnpm format:write

format-check: ## Check formatting (CI)
	pnpm format:check

clean: ## Delete dist folder
	pnpm clean

changeset: ## Create a new changeset
	pnpm changeset

version: ## Apply changesets and bump versions
	pnpm changeset:version

publish: ## Build and publish packages
	pnpm build && pnpm changeset:publish

start: ## Start auth app (standalone production server)
	cp -r -n auth/.next/static auth/.next/standalone/auth/.next/ && \
	cp -r -n auth/public auth/.next/standalone/auth/

	HOSTNAME=0.0.0.0 PORT=8080 pnpm exec dotenv -e auth/.env.local -- pnpm --filter auth start

docker-build: ## Build auth app docker image
	docker build -t ory-auth .

docker-start: docker-build ## Start auth app in docker
	docker run -p 8080:8080 --env-file auth/.env.local ory-auth 