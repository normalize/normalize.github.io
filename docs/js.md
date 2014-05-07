
### Supported Module Systems

Normalize currently compiles ES6 modules to CommonJS and will do so until all modern browsers support ES6 modules natively.
Thus, Normalize is also able to use CommonJS dependencies.

Normalize does not currently support AMD modules.

### Differences with Node's CommonJS

`nlz-build`'s compiled CommonJS format is a little different than other CommonJS formats such as node, browserify, and component.

#### You must always specify the extension

In particular, all `js` files must end with a `.js` extension.
There are no more magical `/index.js` or `.json` look ups.
Imagine, how would this work in the browser?
Multiple HTTP requests would be required, and CSS `@import`s don't work this way.

Note that Node, etc. is compatible with `.js` files,
but it's a little different with `.json` files and transforms.

#### Dependencies use absolute URLs

The purpose of `nlz` is to use absolute URLs to avoid using `.json` files and a package manager.
Thus, something like `require('events')` will be rewritten during normalization to `require('https://npmjs.org/-/events/*/index.js')`.
If this is annoying for you, just use browserify.

#### Dependencies match HTML semantics

In Node, `require('file')` means a dependency.
In `nlz`, if you do `require('file')`,
`nlz` will actually look for `./file`,
which is probably nonexistent.
This matches `@import`, `href`, and `src` semantics, so extensions must be included.

However, `nlz` will simply ignore these as they could be custom modules defined outside the build
(though at this point it's easier to use globals).

### Best Practices

#### Use index.js for browsers, node.js for node.js

Give browsers filename priority,
and specify `.main = 'node.js'` in your `package.json`s.

#### Don't use `import *` or `import {}`

Stick with `module X from 'name'` and `import 'name'`.
These two methods are the most compatible with CommonJS modules.
ES6 modules are not finalized yet,
so many of these features are subject to change.
