NPMBIN = $(shell npm bin)

all: clean dist test docs

ESNEXT = find . -name '*.js' && $(NPMBIN)/esnext -o ../tmp $$(find . -name '*.js')

MODULES = $(NPMBIN)/compile-modules convert -I tmp -f bundle -o dist/index.js

docs: clean-docs
	$(NPMBIN)/jsdoc -r lib -d docs

clean-docs:
	rm -rf docs

lib:
	cd lib && $(ESNEXT)

dist: lib
	$(MODULES) input-sim.umd

test_build: clean_test_dist clean_test_lib
	cd test/lib && $(ESNEXT) && cd ../ && $(MODULES) tmp/index.js

test: test_build
	node_modules/karma/bin/karma start

clean_lib:
	@mkdir -p tmp
	cd tmp && find . -name '*.js' | xargs rm || true

clean_dist:
	@mkdir -p dist
	cd dist && find . -name '*.js*' | xargs rm || true

clean_test_lib:
	@mkdir -p test/tmp
	cd test/tmp && find . -name '*.js' | xargs rm || true

clean_test_dist:
	@mkdir -p test/dist
	cd test/dist && find . -name '*.js' | xargs rm || true

clean: clean_dist clean_lib clean_test_dist clean_test_lib

.PHONY: clean_lib clean lib test
