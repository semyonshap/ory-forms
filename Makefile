.PHONY: typecheck

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
	pnpm version

publish: ## Build, version, and publish packages
	pnpm build && pnpm version && pnpm publish