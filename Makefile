.PHONY: help install build dev typecheck lint lint-fix deps format format-check clean changeset version publish start docker-build docker-start

help: ## Show this help message
	@awk '/^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "##")+3)}' $(MAKEFILE_LIST)

install: ## Install dependencies
	exec pnpm install

build: ## Build packages
	exec pnpm build

dev: ## Run Dev mode
	exec pnpm dev

dev-docker: ## Run Dev mode with Ory docker 
	exec pnpm dev:docker

typecheck: ## Run TypeScript type checking
	exec pnpm typecheck

lint: ## Run ESLint
	exec pnpm lint

lint-fix: ## Auto-fix ESLint issues
	exec pnpm lint:fix

knip: ## Check unused/missing dependencies
	exec pnpm knip

format: ## Format all files (write)
	exec pnpm format:write

format-check: ## Check formatting (CI)
	exec pnpm format:check

clean: ## Delete dist folder
	exec pnpm clean

changeset: ## Create a new changeset
	exec pnpm changeset

version: ## Apply changesets and bump versions
	exec pnpm changeset:version

publish: ## Build and publish packages
	exec pnpm build && pnpm changeset:publish

all: format lint-fix typecheck knip ## Form, Lint, Typecheck, Knip

docker-build: ## Build auth app docker image
	docker build -t ory-auth .

docker-start: docker-build ## Start auth app in docker
	docker run -p 8080:8080 --env-file auth/.env ory-auth 
