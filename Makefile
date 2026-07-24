.PHONY: typecheck

help: ## Show this help message
	@awk '/^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "##")+3)}' $(MAKEFILE_LIST)

install: ## Install dependencies
	pnpm install

typecheck: ## Run TypeScript type checking
	pnpm typecheck

lint: ## Run ESLint
	pnpm lint

clean: ## Delete dist folder
	pnpm clean