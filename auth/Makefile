auth-run:
	cd auth && docker compose build --no-cache && docker compose up -d && docker compose logs -f

find-client-fetch-src:
	find node_modules/@ory/client-fetch/src -type f

find-client-fetch-docs:
	find node_modules/@ory/client-fetch/docs -type f

find-ui:
	find node_modules/@ory/client-fetch/src/models -type f -name "*Ui*" -exec cat {} \; > ory-ui-types.md