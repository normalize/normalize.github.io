jade = ./node_modules/.bin/jade

build: build/index.html build/docs.html

build/index.html: pages/home.jade pages/layout.jade
	$(jade) --path pages/home.jade < pages/home.jade > build/index.html

build/docs.html: pages/docs.jade pages/layout.jade
	$(jade) --path pages/docs.jade < pages/docs.jade > build/docs.html

node_modules:
	npm install

clean:
	rm -rf build

.PHONY: clean
