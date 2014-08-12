### How does Normalize.IO compare to other similar client-side tools?

Normalize's philosophy drastically differs from most client-side tools today, both ES6 and pre-ES6.
Perhaps the biggest difference is that Normalize aims to solve the entire frontend web development via vertical integration,
whereas most tools aim to solve only a particular aspect of frontend development.

The two major ES6 client-side tools I know of are [jspm.io](http://jspm.io) and [stealjs](http://stealjs.com/docs/index.html).
Normalize differs in that:

- Unlike jspm.io, Normalize never advocates using `System` and instead only advocates using `import`s and `export`s.
  Using `System`, which is async, is not much of an improvement over AMD.
- Unlike both, Normalize avoids any client-side complexities and overhead with runtimes such as [ES6 module loader](https://github.com/ModuleLoader/es6-module-loader),
  making it more suitable for production usage.
- Normalize aims to rid the frontend development workflow from install and build steps.
  StealJS requires you to download packages from Bower as well as setup your own Grunt build process.

Normalize is more similar to Component and Browserify except it automatically infers the manifest and dependency tree
via static analysis. With CommonJS, this was more difficult as `require()`s are just functions and
not precisely static. Like both Component and Bower, Normalize supports CSS and HTML as first class citizens.

Bundlers such as Browserify and Webpack are focused on JS and require other assets
to be loaded via JS. This is more suitable for JS-heavy sites such as games,
but is not suitable for design-heavy apps.

A feature of many bundlers such as Browserify and Webpack is the ability to create multiple bundles.
However, Normalize does not and will not bother with bundling as it will become irrelevant with SPDY/HTTP2.

### When shouldn't I use Normalize.IO?

As Normalize aims to rid your workflow of custom build processes,
there must be some cases where Normalize fails to meet your needs.
In particular, anything that requires concatenation won't be suitable for Normalize.
This includes:

- Any build task that are many-to-one such as concatenation (CSS preprocessors) or combining (creating sprite sheets).
  CSS preprocessors such as SASS and LESS that depend on "global" features such as variables, mixins, and inheritance,
  which requires concatenation.
  Variables can be replaced by CSS variables, but mixins and inheritance can not be replaced with vanilla CSS.
  Instead, point Normalize to the "final" output instead of the source files.
- AMD environments as Normalize will not attempt to support such modules.

### Will Normalize.IO support node.js?

Normalize.IO is specifically tailored for frontend development.
In particular, node modules are refactored to work for the browser,
sacrificing node compatibility in the process.

Instead, we will most likely make a similar tool for node.js,
but it may not be the same name or in the same utility.

### Can I omit `http:` or `https://` from the URLs?

If browsers support protocol-less URLs, then so will we.
However, there are a couple potential issues with omitting protocols.

1. It's more difficult to differentiate between URLs and local/relative assets.
2. Some browsers plan to not support non-SSL SPDY, so this might not even work in development.
