
up:
	docker compose -f compose.dev.yml up -d
.PHONY up

down:
	docker compose -f compose.dev.yml down
.PHONY up

build:
	docker compose -f compose.dev.yml up -d --build
.PHONY up

recreate:
	docker compose -f compose.dev.yml up -d --build --force-recreate
.PHONY up