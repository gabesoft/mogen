default: build

MOCHA=node_modules/.bin/mocha --compilers coffee:coffee-script-redux -u tdd

all: test

.PHONY: release test loc clean

VERSION = $(shell node -pe 'require("./package.json").version')
release-patch: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "patch")')
release-minor: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "minor")')
release-major: NEXT_VERSION = $(shell node -pe 'require("semver").inc("$(VERSION)", "major")')
release-patch: release
release-minor: release
release-major: release

release: build test
	@printf "Current version is $(VERSION). This will publish version $(NEXT_VERSION). Press [enter] to continue." >&2
	@read
	node -e '\
		var j = require("./package.json");\
		j.version = "$(NEXT_VERSION)";\
		var s = JSON.stringify(j, null, 2);\
		require("fs").writeFileSync("./package.json", s);'
	git commit package.json -m 'Version $(NEXT_VERSION)'
	git tag -a "v$(NEXT_VERSION)" -m "Version $(NEXT_VERSION)"
	git push --tags origin HEAD:master

# run with make dep d=package
dep:
	npm install --save $(d)

tag:
	git tag -a "v$(VERSION)" -m "Version $(VERSION)"

tag-push: tag
	git push --tags origin HEAD:master

test:
	$(MOCHA) -R dot test/*.coffee

loc:
	wc -l src/*

setup:
	npm install . -d

clean-dep:
	rm -rf node_modules
