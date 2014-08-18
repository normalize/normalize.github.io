# nlz.io

This is the landing and documentation page for https://nlz.io as well as http://normalize.github.io (static version).
Of course, this uses [nlz](https://github.com/normalize/nlz) to build the site.

## Structure

The client-side JS and CSS are stored in the `client/` folder with `index.*` entry points.
The homepage is stored in `home/` and the docs are stored in `docs/`.

`index.*` and `.html` files in the root directory are all built files.
You can see how `nlz(1)` creates JS and CSS files by looking at `index.js` and `index.css`, respectively.

`watch.js` is a simple custom watcher for building our jade/markdown templates.

## Installation and Setup

First, install `nlz`:

```bash
npm i -g nlz
```

To build the JS and CSS, run the following:

```bash
nlz build --watch
```

Notice how the entry points are defined within `.nlzrc`.

Then to build the pages,
install the `npm` dependencies and run `node watch.js`.

```bash
npm i
node watch.js
```
