NPMBIN = $(shell npm bin)

all: clean dist test

ESNEXT = find . -name '*.js' && $(NPMBIN)/esnext -o ../tmp $$(find . -name '*.js')

MODULES = $(NPMBIN)/compile-modules convert -I tmp -f bundle -o dist/index.js tmp/index.js

lib:
	cd lib && $(ESNEXT)

dist: lib
	$(MODULES)

test_build: clean_test_dist clean_test_lib
	cd test/lib && $(ESNEXT) && cd ../ && $(MODULES)

test: test_build
	node_modules/karma/bin/karma start

clean_lib:
	cd tmp && find . -name '*.js' | xargs rm || true

clean_dist:
	cd dist && find . -name '*.js*' | xargs rm || true

clean_test_lib:
	cd test/tmp && find . -name '*.js' | xargs rm || true

clean_test_dist:
	cd test/dist && find . -name '*.js' | xargs rm || true

clean: clean_dist clean_lib clean_test_dist clean_test_lib

.PHONY: clean_lib clean lib test
