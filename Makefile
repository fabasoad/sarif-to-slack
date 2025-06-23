.PHONY: audit build clean install reinstall lint start test npm/update pre-commit/update update

.DEFAULT_GOAL := build

audit:
	@npm audit --all

build:
	@npm run build

clean:
	@npm run clean

install:
	@npm install

reinstall: clean install

lint:
	@npm run lint

test:
	@npm run test

npm/update:
	@npm update

pre-commit/update:
	@pre-commit autoupdate

update: npm/update pre-commit/update
