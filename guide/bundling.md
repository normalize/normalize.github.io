
As shown via `nlz build(1)`,
you can build multiple entry points, whether `.js` or `.css`,
all at the same time.

```bash
nlz build index.js something.js else.js
```

However, you probably want a couple of partial bundles,
one for the initial page load and the others for specific pages.

```html
<script src="boot.js"></script>
<script src="homepage.js"></script>
```

To do is very simple: have `boot.js` and `homepage.js` as entry points
and have `homepage.js` depend on `boot.js` directly:

```js
// homepage.js:
import 'boot.js'
```

Then create a build with both entry points:

```bash
nlz build boot.js homepage.js
```

Now you will have to entry points, `boot.js` and `homepage.js`.
`boot.js` will be required to use `homepage.js`,
and none of `boot.js`'s dependencies will be included in `homepage.js`.

If you want to create a single `homepage.js` bundle,
just build it independently:

```bash
nlz build homepage.js
```

Now `homepage.js` will include all of `boot.js`.

This will work with JS as well as CSS.

> Notes:
>   - Common bundles are not supported.
>   - All entry points must be defined with their all their dependencies defined prior.
