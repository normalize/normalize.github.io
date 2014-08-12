
These are all the transforms available for both the normalization proxy and `nlz-build(1)`.

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

### How Transforms Work

Given a source file such as `template.html`,
the walker transforms the file based on additional `.<extensions>`.
For example, `template.html.js` will export the HTML string as a JS string.
This is superior to other transform systems because:

- It's compatible with HTTP servers
- The transforms used are explicitly shown
- It allows you to use the same source file in multiple ways without configuration

For example, `template.jade.js` returns a jade render function whereas `template.jade.html.js` returns the jade template as a compiled string.

You can also compose multiple transforms together.
For example, `.jade.html.js` is a composition of `.jade.html` and `.html.js`.

Unlike other build systems,
transforms have the ability to inject dependencies into your application and automatically install them,
making development easier in general.
For example, to use `.jade.js`, you need the [jade runtime](https://github.com/facebook/regenerator/blob/master/runtime/dev.js).
The Jade transform will automatically inject the runtime by compiling your jade template to something like this:

```js
import jade from 'https://nlz.io/github/visionmedia/jade/1/lib/runtime.js'

export default function template(locals) {
  // compiled jade
}
```

### CSS Transforms

#### `less.css`

Convert LESS files to CSS.

```css
@import 'styles.less.css';
```

#### `(sass|scss).css`

Convert SASS files to CSS.

```css
@import 'styles.sass.css';
@import 'styles.scss.css';
```

#### `stylus.css`

Convert Stylus files to CSS.

```css
@import 'styles.styl.css';
```

### JS Transforms

#### `.<mime:text/*>.js`

All extensions whose corresponding MIME type is `text/*` are automatically transformed to a JS string using `JSON.stringify()` unless superceded by another transform.

```js
import text from 'something.txt'

var el = document.createTextNode()
el.textContent = text
```

#### `.json.js`

Transforms JSON files to a JS object.

```js
import data from 'data.json'

var name = data.name
```

#### `.coffee.js`

Transforms a CoffeeScript file to JS.

```js
import fn from 'thing.coffee'

fn()
```

### Template Transforms

#### `.jade.html`

Compile [jade](https://github.com/visionmedia/jade) templates to an HTML string.
For example, combined with the `.<mime:text/*>.js` transform:

```js
import html from 'template.html'

el.innerHTML = html
```

#### `.jade.js`

Compile [jade](https://github.com/visionmedia/jade) templates to a function.

```js
import render from 'template.jade'
import data from 'data.json'

el.innerHTML = render(data)
```

#### `.(md|markdown).html`

Compile markdown templates to an HTML string using [marked](https://github.com/chjj/marked).
Note that without `.html`, the actual markdown is returned.

```js
import html from 'article.md.html'

el.innerHTML = html
```

#### `.jsx.js`

Compile [React](http://facebook.github.io/react/) `.jsx` templates to JS.

#### `.html.domify.js`

Compile an HTML string to an element using [domify](https://github.com/component/domify).
This is useful for web components and templates.

```js
import template from 'template.html.domify'

document.body.appendChild(template.cloneNode(true))
```
