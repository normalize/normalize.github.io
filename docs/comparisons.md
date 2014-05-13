
### Bundling vs. Browserify

`nlz build(1)` is pretty similar to Browserify.
How does the bundling compare?
Let's compare the created bundles for [dom-elements](https://github.com/barberboy/dom-elements).
We'll do basic builds, minification, and compression.
You can view the [Makefile](https://github.com/normalize/comparisons/blob/master/Makefile).

| Build       | Normalize | Browserify |
|-------------|-----------|------------|
| .js         | 10,525b   | 6,625b     |
| .min.js     | 5,494b    | 3,425b     |
| .min.js.gz  | 1,292b    | 1,328b     |

What you'll see is that Normalize's JS builds are larger than Browserify's.
This is due to a couple of reasons:

1. Normalize doesn't automatically minimize the `require()` implementation.
  Doing so unnecessarily hides the magic from developers.
2. Normalize doesn't wrap the build within a closure.
  Developers can do that themselves.
  This allows developers to `require('./index.js')` outside the build.
3. Normalize uses the full URL for dependencies.
  `require('../utils/separate-selector.js')` is expanded to `require('https://nlz.io/github/barberboy/dom-elements/0.1.0/src/utils/separate-selector.js')`.
4. Normalize adds comments to each file for debugging.

But then you'll notice that Normalize's gzip build is actually smaller than browserify's.
In the end, the gzip size is all that matters.
This is primarily due to two reasons:

1. Absolute URLs are mostly redundant and very compressible.
2. The `require()` implementation is minimal and is basically just a hash lookup.
