
Normalize's philosophy drastically differs from most client-side tools today, both ES6 and pre-ES6.
Perhaps the biggest difference is that Normalize aims to solve __almost everything__
about frontend web development, whereas most tools aim to solve a particular aspect of frontend development.

The two major ES6 client-side tools I know of are [jspm.io](http://jspm.io) and [stealjs](http://stealjs.com/docs/index.html).
Normalize differs in that:

- Unlike jspm.io, Normalize never advocates using `System` and instead only advocates using `import`s and `export`s.
  Using `System`, which is async, is not much of an improvement over AMD.
- Unlike both, Normalize avoids any client-side complexities and overhead with runtimes such as [ES6 module loader](https://github.com/ModuleLoader/es6-module-loader),
  making it more suitable for production usage.
- Normalize aims to rid the frontend development workflow from install and build steps.
  StealJS requires you to download packages from Bower as well as setup your own Grunt build process.

Normalize is more similar to Component except it automatically infers the manifest and dependency tree
via static analysis. With CommonJS, this was more difficult as `require()`s are just functions and
not precisely static. Also like both Component and Bower, Normalize supports CSS and HTML as first class citizens.

Other bundlers such as Browserify and Webpack are focused on JS and require other assets
to be loaded via JS. This is more suitable for JS-heavy sites such as games,
but is not suitable for design-heavy apps.

A feature of many bundlers such as browserify and webpack are the ability to create multiple bundles.
However, Normalize does not and will not bother with such features as they are irrelevant with SPDY.
If the client doesn't need a particular file, then it won't request it, or it will cancel the SPDY push stream.

As Normalize aims to rid your workflow of custom build processes,
there must be some cases where Normalize fails to meet your app's needs.
In particular, anything that requires concatenation won't be suitable for Normalize.
This includes:

- Any build task that are many-to-one such as concatenation (CSS preprocessors) or combining (creating sprite sheets).
  CSS preprocessors such as SASS and LESS that depend on "global" features such as variables, mixins, and inheritance,
  which requires concatenation.
  Variables can be replaced by CSS variables, but mixins and inheritance can not be replaced with vanilla CSS.
  Instead, point Normalize to the "final" output instead of the source files.
- AMD environments as Normalize will not attempt to support such modules.
- Locale support, particularly translations and RTL. We intend to support these, but we're not
  sure what the best course of action is, so if your company needs these now, you might want to wait on Normalize.
