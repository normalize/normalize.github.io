
These are all the transforms available for both the normalization proxy and `nlz-build(1)`.

There are multiple types of transforms which are not mutually exclusive:

- Build-only - `nlz-build(1)`-only transforms
- Ubiquitus - transforms for both the CLI and the proxy.
- 1-to-1 - All included in  [normalize-transforms](https://github.com/normalize/transforms.js)
- Global-build-only - Global transforms for `nlz-build(1)`, specifically CSS transforms.
  These are all included in [normalize-build](https://github.com/normalize/build.js) and contrast 1-to-1 transforms.
- Extension - Extension-based transforms
- Tranparent - Transforms without an extension

Unlike other bundlers and build systems,
adapters transforms are included automatically.
There are a couple of reasons for this:

- This middleware system is a more complicated than other middleware systems:
    - The use of Koa-based upstream/downstream is quite complex
    - Order of middleware is very important
    - Transforms are not orthogonal to another,
      so we have to make sure each plugin interacts with each other well.
- The purpose of normalization is for everyone to be on the same page.
  It's counter productive to have different semantics for the same transform across applications.

However, for both the proxy and for `nlz(1)`,
__you must install each underlying library yourself__.
If all libraries were included,
then `nlz(1)` will quickly grow to `100mb+` as well as have a very long install time
due to all the C/C++ addons these libraries use.
For example, to use the Jade transform, you must also install Jade globally:

```bash
# Install Normalize
npm i -g nlz
# Install Jade as well
npm i -g jade
```

PRs for additional transforms are welcomed as long as there's a valid use-case and people would actually use it.
Feel free to create feature requests and pull requests in the [transform.js](https://github.com/normalize/transforms.js) repository.

### How Extension-based Transforms Work

Given a source file such as `template.html`,
the walker transforms the file based on additional `.<extensions>`.
For example, `template.html.js` will export the HTML string as a JS string.
This is superior because:

- It's compatible with HTTP servers
- The transforms used are explicitly shown
- It allows you to use the same source file in multiple ways without configuration

For example, `template.jade.js` returns a jade render function whereas `template.jade.html.js` returns the jade template as a compiled string.

You can also compose multiple transforms together.
For example, `.jade.html.js` is a composition of `.jade.html` and `.html.js`.

Unlike other build systems,
transforms have the ability to inject dependencies into your application and automatically install them,
making development easier in general.
For example, to use `.jade.js`, you need to [jade runtime](https://github.com/facebook/regenerator/blob/master/runtime/dev.js).
The Jade transform will automatically inject the runtime by compiling your jade template to something like this:

```js
import jade from 'https://nlz.io/github/visionmedia/jade/1/lib/runtime.js'

export default function template(locals) {
  // compiled jade
}
```

### CSS Transforms

#### Autoprefixer

Type: Transparent, 1-to-1, ubiquitous

All CSS is automatically prefixed using [autoprefixer](https://github.com/ai/autoprefixer).
No extensions are necessary.
The default options are used.

#### CSS Variables

Type: Global-build-only, transparent

CSS Variables support via [variables](https://github.com/css-utils/variables).

#### CSS Color Function

Type: Global-build-only, transparent

CSS color manipulation via [css-colors](https://github.com/css-utils/colors).

#### `less.css`

Type: Ubiquitous, 1-to-1, extension

Convert LESS files to CSS.

```css
@import 'styles.less.css';
```

#### `(sass|scss).css`

Type: Ubiquitous, 1-to-1, extension

Convert SASS files to CSS.

```css
@import 'styles.sass.css';
@import 'styles.scss.css';
```

#### `stylus.css`

Type: Ubiquitous, 1-to-1, extension

Convert Stylus files to CSS.

```css
@import 'styles.styl.css';
```

### JS Transforms

#### ES6 Modules

Type: Build-only, 1-to-1, transparent

All ES6 modules are automatically transpiled to CommonJS modules using [es6-module-jstransform](https://github.com/andreypopp/es6-module-jstransform).
This will be disabled by default once ES6 modules are widely supported by browsers.

#### Regenerator

Type: Build-only, 1-to-1, transparent

All code that uses generators are automatically transformed using [regenerator](https://github.com/facebook/regenerator).
This will be disabled by default once generators are widely supported by browsers.

#### `.<mime:text/*>.js`

Type: Ubiquitous, 1-to-1, extension

All extensions whose corresponding MIME type is `text/*` are automatically transformed to a JS string using `JSON.stringify()` unless superceded by another transform.

```js
import text from 'something.txt'

var el = document.createTextNode()
el.textContent = text
```

#### `.json.js`

Type: Ubiquitous, 1-to-1, extension

Transforms JSON files to a JS object.

```js
import data from 'data.json'

var name = data.name
```

#### `.coffee.js`

Type: Ubiquitous, 1-to-1, extension

Transforms a CoffeeScript file to JS.

```js
import fn from 'thing.coffee.js'

fn()
```

### Template Transforms

#### `.jade.html`

Type: Ubiquitous, 1-to-1, extension

Compile [jade](https://github.com/visionmedia/jade) templates to an HTML string.
For example, combined with the `.<mime:text/*>.js` transform:

```js
import html from 'template.html.js'

el.innerHTML = html
```

#### `.jade.js`

Type: Ubiquitous, 1-to-1, extension

Compile [jade](https://github.com/visionmedia/jade) templates to a function.

```js
import render from 'template.jade.js'
import data from 'data.json'

el.innerHTML = render(data)
```

#### `.(md|markdown).html`

Type: Ubiquitous, 1-to-1, extension

Compile markdown templates to an HTML string using [marked](https://github.com/chjj/marked).
Note that without `.html`, the actual markdown is returned.

```js
import html from 'article.md.html.js'

el.innerHTML = html
```

#### `.jsx.js`

Type: Ubiquitous, 1-to-1, extension

Compile [React](http://facebook.github.io/react/) `.jsx` templates to JS.

#### `.html.domify.js`

Type: Ubiquitous, 1-to-1, extension

Compile an HTML string to an element using [domify](https://github.com/component/domify).
This is useful for web components and templates.

```js
var template = require('./template.html.domify.js')

document.body.appendChild(template.cloneNode(true))
```
