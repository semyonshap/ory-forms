.PHONY: help install docker-build docker-start

help: ## Show this help message
	@awk '/^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "##")+3)}' $(MAKEFILE_LIST)

docker-build: ## Build auth app docker image
	docker build -t ory-auth .
