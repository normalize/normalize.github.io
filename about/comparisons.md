
### Bundling vs. Browserify vs. Webpack

`nlz build(1)` is pretty similar to Browserify.
How does the bundling compare?
Let's compare the created bundles for [dom-elements](https://github.com/barberboy/dom-elements).
We'll do basic builds, minification, and compression.
You can view the [Makefile](https://github.com/normalize/comparisons/blob/master/Makefile).

| Build       | Normalize | Browserify | Webpack    |
|-------------|-----------|------------|------------|
| .js         | 9,663b    | 6,717b     | 7,939b     |
| .min.js     | 4,632b    | 3,486b     | 2,585b     |
| .min.js.gz  | 1,252b    | 1,346b     | 1,060b     |

What you'll see is that Normalize's JS builds are larger than Browserify's.
This is due to a couple of reasons:

1. Normalize doesn't automatically minimize the `require()` implementation.
  Doing so unnecessarily hides the magic from developers.
2. Normalize doesn't wrap the build within a closure.
  Developers can do that themselves.
  This allows developers to `require('./index.js')` outside the build.
3. Normalize dependency names are generally longer to keep them unique.
4. Normalize adds comments to each file for debugging.

But then you'll notice that Normalize's gzip build is actually smaller than browserify's.
In the end, the gzip size is all that matters.
This is primarily due to two reasons:

1. Absolute URLs are mostly redundant and very compressible.
2. The `require()` implementation is minimal and is basically just a hash lookup.

But why is Webpack superior than both Normalize and Browserify?
If you look at the Webpack bundle, you'll notice two things:

1. Module IDs are rewritten into numbers (stored in an array)
2. All modules are loaded in an array

Normalize won't ever do 1) because this will make modules difficult to use outside the bundle
as well as make the resulting bundle more difficult to read.
`require()` is global by default so developers can `require()` outside the build.
The bundle will be smaller if wrapped in a closure.

Normalize may eventually do 2) only if supported by ES6 module loaders,
but until then, it's easier if each module is disjoint from the other.

### vs. jspm.io and family

A similar project is [jspm.io](http://jspm.io).
Some key differences are:

- There are no required special syntaxes. URLs are just URLs.
  Special syntaxes are optional and require the developer to create their own custom
  ES6 module loader on the client.
- Normalize is not client-side heavy and does not necessitate the use of polyfills.
  Normalize bundling overhead is minimal.
- Normalize treats non-js assets as first-class citizens.
- Normalize does not have its own registry.
- Normalize has the ability to proxy from arbitrary remotes.
- Normalize treats dynamic imports as second class citizens.
