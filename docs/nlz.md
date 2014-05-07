
`nlz(1)` is the stopgap CLI tool for normalization proxies.
Eventually, `nlz build(1)` will be completely optional,
and `nlz(1)` will primarily be a CLI tool for inspecting your app/component's dependency tree.

### Installation

Currently, you must install `nlz(1)` with `npm(1)`:

```bash
npm install -g nlz
```

`nlz(1)` only supports node v0.10,
but you should use node v0.11+ for better performance as generators are extensively used in the source code.

### nlz build

This is the primary build command.
You may think of it as [browserify](http://browserify.org)'s build command,
but multiple entry points are supported,
as well as CSS and (eventually) HTML files.

Most of these parameters and options can be set via `.nlzrc`,
allowing developers to simply run `nlz build --watch`.

#### Entry Points

```bash
nlz build [entrypoints...]

// will build to build/index.js and build/index.css, respectively
nlz build client/index.js client/index.css
```

#### --out

The destination folder, defaulting to `build/`.
The destination file will be the same name as the entry point's file name.

#### --watch

Watch the source files for changes and rebuild automatically.
You __should__ use this as rebuilds are fast and incremental.
Simply loading `nlz(1)` takes a considerable amount of time,
especially if you use a lot of transformations.
