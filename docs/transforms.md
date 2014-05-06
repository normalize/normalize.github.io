
These are all the transforms available for both the normalization proxy and `nlz-build`.
Unlike Component, Browserify, and other build systems,
transforms are included automatically,
and all transforms are stored in a single repository.
There are a couple of reasons for this:

- This middleware system is a more complicated than other middleware systems:

    - The use of Koa-based upstream/downstream is quite complex
    - Order of middleware is very important, especially when handling upstreams/downstreams
    - Transforms are not orthogonal to another, so we have to make sure each plugin interacts with each other well.
      This is more difficult than creating the transforms themselves.

- The purpose of normalization is for everyone to be on the same page.
  It's counter productive to have different semantics for the same transform across applications.

PRs for additional transforms are welcomed as long as there's a valid use-case and people would actually use it.

### How Transforms Work

Given a source file such as `template.html`,
the walker transforms the file based on additional `.<extensions>`.
For example, `template.html.js` will export the HTML string as a JS string.
This is superior because:

- It's compatible with HTTP servers
- The transforms used are explicitly shown
- It allows you to use the same source file in multiple ways without configuration

For example, `template.jade.js` would return a jade render function whereas `template.jade.html.js` will return the jade template as a compiled string.

You can also compose multiple transforms together.
For example, `.jade.html` is its own transform and so is `.html.js`.
Together, `.jade.html.js` has a very specific meaning.
In other words, `.jade.html.js` is a composition of transforms!

Unlike other build systems and package managers,
transforms have the ability to inject required dependencies into your application,
making development easier in general.
For example, to use `.jade.js`, you need to [jade runtime](https://github.com/facebook/regenerator/blob/master/runtime/dev.js).
The Jade transform will automatically inject the runtime by compiling your jade template to something like this:

```js
var jade = require('https://nlz.io/github/visionmedia/jade/1/lib/runtime.js')

module.exports = function template(locals) {
  // compiled jade
}
```

### Transforms

#### CSS

##### Autoprefixer

All CSS is automatically prefixed using [autoprefixer](https://github.com/ai/autoprefixer).
No extensions are necessary.
The default options are used.

##### Rework

A subset of specification compliant [rework](https://github.com/reworkcss/rework) plugins are included.
These are essentially a subset of [myth](https://github.com/segmentio/myth).
These are:

- Color manipulation via [rework-color-function](https://github.com/ianstormtaylor/rework-color-function)
- Math via [rework-calc](http://www.w3.org/TR/css3-values/#calc-notation)
- 4/8-digit hex color support via [rework-hex-alpha](https://github.com/ianstormtaylor/rework-hex-alpha)
- Font-variant shorthands via [rework-font-variant](https://github.com/ianstormtaylor/rework-font-variant)

#### JS

##### ES6 Modules

All ES6 modules are automatically transpiled to CommonJS modules using [es6-module-jstransform](https://github.com/andreypopp/es6-module-jstransform).
This will be disabled by default once ES6 modules are widely supported by browsers.

##### Regenerator

All code that uses generators are automatically transformed using [regenerator](https://github.com/facebook/regenerator).
This will be disabled by default once generators are widely supported by browsers.

##### `.<mime:text/*>.js`

All extensions whose corresponding MIME type is `text/*` are automatically transformed to a JS string using `JSON.stringify()` unless superceded by another transform.

This is included in `normalize-walker`.

##### `.json.js`

Transforms JSON files to a JS object.

This is included in `normalize-walker`.

#### Templates

##### `.jade.html`

Compile [jade](https://github.com/visionmedia/jade) templates to an HTML string.

##### `.jade.js`

Compile [jade](https://github.com/visionmedia/jade) templates to a function.

##### `.(md|markdown).html`

Compile markdown templates to an HTML string using [marked](https://github.com/chjj/marked).

##### `.jsx.js`

Compile [React](http://facebook.github.io/react/) `.jsx` templates to JS.

##### `.html.domify.js`

Compile an HTML string to an element using [domify](https://github.com/component/domify).
This is useful for web components and templates.

```js
var template = require('./template.html.domify.js')

document.body.appendChild(template.cloneNode(true))
```
