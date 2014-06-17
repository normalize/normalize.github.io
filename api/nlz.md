
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

Be sure to globally install any transforms you'd like to use as well.

```bash
npm install -g jade marked
```

### normalize-manifest.json

When running `nlz-build(1)` or `nlz-manifest(1)`,
a `normalize-manifest.json` file is created.
You can use this to inspect all the files in the build as well as its
dependency tree.
`nlz(1)` uses this file in other commands, such as `nlz-dependencies(1)`,
to help inspect the files and the dependency tree.
Be sure to add this file to your `.gitignore`!

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

#### --out, -o

The destination folder, defaulting to `build/`.
The destination file will be the same name as the entry point's file name.

```bash
nlz build client/index.js --out public
```

#### --watch, -w

Watch the source files for changes and rebuild automatically.
You __should__ use this as rebuilds are fast and incremental.
Simply loading `nlz(1)` takes a considerable amount of time,
especially if you use a lot of transformations.

```bash
nlz build client/index.js --watch
```

### nlz manifest

Similar to `nlz-build(1)`,
except no files will actually be built.
Use this just to create `normalize-manifest.json`,
which is required for the dependency inspection commands.

#### --no-min, -M

By default, `nlz-manifest(1)` calculates the minified size of assets.
This gives each file a better representation of its size
in the final bundle.
However, this takes a long time compute.
Set `--no-min` to disable minified size calculations.

### nlz dependencies

List all the dependencies,
included nested ones,
of a single entry point.
Unlike other "ls" type commands,
this command does not create an incredibly nested tree.
The file size is listed next to each file.

```bash
nlz dependencies <entrypoint>

// list the dependencies of a single file
nlz dependencies index.js
```

![nlz-dependencies(1)](images/nlz-dependencies.png)

#### --remotes, -r

By default, dependencies of remote dependencies are not traversed.
To include them, use the `--remotes` option.

### nlz dependents

This command is similar to `nlz-dependencies(1)`,
except shows all the nested dependents of a particular file.
Any file included in the manifest could be used as an entry point.

```bash
nlz dependencies <entrypoint>

// list all the nested dependents of component/emitter@1.1.2
nlz dependents component/emitter@1.1.2
```

![nlz-dependents(1)](images/nlz-dependents.png)

### nlz duplicates

Lists all remote dependents of which you use more than a single version.
In frontend development,
you don't want duplicate dependencies as it means unnecessary bandwidth usage.

```bash
// list the duplicate dependencies
// based on the current normalize-manifest.json
nlz duplicates
```

`nlz-duplicates(1)` will show:

- The "redundancy size", or the estimated bytes you could save by de-duping each dependency.
- Each version of the dependency used.
- Each file of each dependency used, it's size, and its dependents.

![nlz-duplicates(1)](images/nlz-duplicates.png)

### nlz size

List the sizes of an entry point and its dependencies,
as well as its combined size.
Useful for gauging which dependency is the largest.

```bash
nlz size <entrypoint>

// get the size of test/index.js and its dependencies
nlz size test/index.js
```

![nlz-size(1)](images/nlz-size.png)

#### --exts, -e

Filter the files by a comma-separated list of extensions.
For example:

```bash
nlz size -e js,css,svg test/index.js
```

#### --threshold, -t

Only show files larger than a `threshold` file size.
For example, only list files larger than `1kb`:

```bash
nlz size -t 1kb test/index.js
```
