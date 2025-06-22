.PHONY: audit build clean install reinstall lint start test upgrade

.DEFAULT_GOAL := build

audit:
	@yarn npm audit --all

build:
	@yarn run build

clean:
	@yarn run clean

install:
	@yarn install

reinstall: clean install

lint:
	@yarn run lint

test:
	@yarn run test

upgrade:
	@pre-commit autoupdate
	@yarn upgrade-interactive
