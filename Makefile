NPMBIN = $(shell npm bin)
ROLLUP = $(NPMBIN)/rollup
BABEL = $(NPMBIN)/babel

all: clean dist test docs

dist/input-sim.js: src/*.js
	@mkdir -p dist
	$(ROLLUP) src/input-sim.js | $(BABEL) -m umd --module-id InputSim > dist/input-sim.js

dist: dist/input-sim.js

test: dist test/.build/test-bundle.js
	node_modules/karma/bin/karma start

test/.build/test-bundle.js: src/*.js test/*.js
	@mkdir -p $(shell dirname $@)
	$(ROLLUP) test/input-sim.js | $(BABEL) > $@

clean: clean-docs clean-dist clean-test

docs: clean-docs
	$(NPMBIN)/jsdoc -r src -d docs

clean-docs:
	rm -rf docs

clean-dist:
	rm -rf dist

clean-test:
	rm -rf test/.build

.PHONY: clean-docs clean-dist clean dist test
