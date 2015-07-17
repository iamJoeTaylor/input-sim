NPMBIN = $(shell npm bin)
ESNEXT = find . -name '*.js' && $(NPMBIN)/esnext -o ../lib $$(find . -name '*.js')
MODULES = $(NPMBIN)/compile-modules convert -I lib -f bundle -o dist/input-sim.js

all: clean dist test docs

build_source:
	cd src && $(ESNEXT)

lib:
	cd lib && $(ESNEXT)

dist: build_source
	$(MODULES) input-sim.umd

test_build: clean_test_dist clean_test_lib
	cd test/src && $(ESNEXT) && cd ../ && $(MODULES) lib/input-sim.js

test: test_build
	node_modules/karma/bin/karma start

clean_lib:
	@mkdir -p lib
	cd lib && find . -name '*.js' | xargs rm || true

clean_dist:
	@mkdir -p dist
	cd dist && find . -name '*.js*' | xargs rm || true

clean_test_lib:
	@mkdir -p test/lib
	cd test/lib && find . -name '*.js' | xargs rm || true

clean_test_dist:
	@mkdir -p test/dist
	cd test/dist && find . -name '*.js' | xargs rm || true

clean: clean_dist clean_lib clean_test_dist clean_test_lib

docs: clean-docs
	$(NPMBIN)/jsdoc -r src -d docs

clean-docs:
	rm -rf docs

.PHONY: clean_lib clean lib test
