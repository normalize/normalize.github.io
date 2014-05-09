
This is the public HTTP API for https://nlz.io as well as any [normalize-proxy][proxy].
If you're interested in setting up your own proxy,
consult the [normalize-proxy repository][proxy].

### URL Structure

URLs generally have the form:

```
https://nlz.io/<remote>/<user>/<project>/<version>/<file>
```

Obviously, different proxies will have different hostnames.
The `version` and `file` may not be included in some end points.

#### Protocol

Every proxy __must__ serve via HTTPS and SPDY/HTTPv2,
even with a self-signed certificate.

#### Remote

A supported remote's name, for example `github/`.

Aliases will also be supported and will simply redirect to the canonical short name.
For example, `github.com` and `raw.githubusercontent.com` would redirect to `github`.

#### User

The owner of a repository.
If the remote does not have a namespace, the user should simply be `-`.

```bash
https://nlz.io/npm/-/escape-regexp/*/index.js
```

#### Project

The name of the project or module.

#### Version

Any version as defined by http://semver.org v2.0.0.
You should not include leading `v`s and `=` in single versions

Eventually, commit SHAs for `git` remotes will be supported.
However, branches will never be supported.

### API End Points

#### GET File

You may still `GET` files directly, even with transforms.
All of the files' dependencies will be SPDY pushed to the client.
A redirect may be returned as a response.
If this is the case, the redirect location will be SPDY pushed as well.

Each file can have the following query strings.
These are only valid when __exact__, so don't include a trailing `=`.
Only one query string can be used at a time:

- `?source` - return/redirect the source file and its dependencies all without any transformations applied. Useful for building server-side.
- `?min` - minify the transformation. Only applies to JS, CSS, and HTML assets.

If any of these query strings are included,
then all the pushed dependencies will also include the same query string.

Each file will have an `ETag` header which is the `sha256` sum of the __source__ file.
Thus, the only real way to verify whether this header is correct is to check the `?source` file.
The ETag will remain the same between query strings and differences in transforms

Note that the ETag header is subject to change as this is obviously less than ideal.

#### GET pull

```
GET https://nlz.io/<remote>/<user>/<project>/pull
```

This will `pull` a specific version from the remote if it has not be installed already.
If successful, a `204` status code will be returned.
You may consider this the optional "publish" step of Normalize.IO.

#### GET versions.json

```
GET https://nlz.io/<remote>/<user>/<project>/versions.json
```

Will return an array of versions that are currently available on the proxy.
If no versions are installed,
a `404` and an empty array will be returned.

If you pushed a new version of a package,
but the proxy has not installed it yet,
simply install it by hitting the `pull` entry point or `GET` any file.

The semantics of this endpoint is subject to change.
In particular, it should return all available versions on the remote.

#### GET metadata.json

```
GET https://nlz.io/<remote>/<user>/<project>/metadata.json
```

Per-repository metadata that is not version-specific.
This is where you'll find metadata such as author, keywords, etc.

> Note: not yet implemented.

#### GET search.json

```
GET https://nlz.io/search.json?...
```

Search the proxy's installed files and projects.
All search parameters should be passed as query string parameters.
These may include:

- `remote`
- `user`/`owner`/`organization`
- `project`/`repository`
- `keywords`

> Note: not yet implemented.

#### GET proxy.json

```js
GET https://nlz.io/proxy.json
```

Returns relevant information about the proxy including hostname, version, and supported remotes.

### Normalization

Packages are "normalized" based on these JSON files in descending priority.

1. `component.json`
2. `package.json`
3. `bower.json`

This is particularly important if you compile your module for one package manager but not the others.
Thus, if you have to compile your module for a package manager,
compile it for `bower`.

#### package.json

Only `npm` and `github`-style dependencies are supported.
Only semantic versions are supported - versions that have weird suffixes will be ignored.
Other types of dependencies such as tarballs will be ignored.

#### Circular Dependencies

Modules that must be normalized and have circular dependencies are not supported.
In fact, these modules may actually mess up the proxy.
Please don't create circular dependencies!
Use `devDependencies` or something instead.

### Module Classification

The normalization proxy is currently designed primarily for web components and modules.
Thus, it needs a way to classify whether a module is web-compatible.
Currently, classification is defined by the following criteria:

- `index.html` exists
- `index.css` exists
- `component.json` exists
- `bower.json` exists
- `package.json`:

  - `.browser` exists
  - `.style` exists

[proxy]: https://github.com/normalize/proxy.js
