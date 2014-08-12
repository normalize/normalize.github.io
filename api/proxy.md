
This is the public HTTP API for https://nlz.io as well as any [normalize-proxy][proxy].
If you're interested in setting up your own proxy,
consult the [normalize-proxy repository][proxy] itself.

### URL Structure

All URLs have the form:

```
https://nlz.io/<remote>/<user>/<project>/<version>/<file...>
```

Different proxies will have different hostnames.
The `version` and `file` may not be included in some end points.

#### Protocol

Every proxy __must__ serve via HTTPS and SPDY/HTTPv2,
even with a self-signed certificate.
The primary reason is that some browsers intend to not support SPDY without SSL.

#### Remote

A supported remote's name, for example `github/`.

Aliases will also be supported and will simply redirect to the canonical short name.
For example, `github.com` and `raw.githubusercontent.com` would redirect to `github`.

#### User

The owner of a repository.
If the remote does not have a namespace, the user should simply be `-`.

```
https://nlz.io/npm/-/escape-regexp/*/index.js
```

#### Project

The name of the project/module/component.

#### Version

Any version as defined by http://semver.org.
You should not include leading `v`s and `=` in single versions otherwise a redirect will occur.

Versions can also be git branches and commit SHAs if the remote is accessed via git
and will redirect to the full commit sha.

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

If any of these query strings are included,
then all the pushed dependencies will also include the same query string.

#### GET pull

```
GET https://nlz.io/<remote>/<user>/<project>/pull
```

For git remotes, this will `git fetch -f` the entire repository to the proxy,
updating all the versions.

For non-git remotes, this will check for the latest version of the project
and install it locally.

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

> Note: he semantics of this endpoint is subject to change.
> In particular, it should return all available versions on the remote.

#### GET proxy.json

```js
GET https://nlz.io/proxy.json
```

Returns relevant information about the proxy including hostname, version, and supported remotes.

#### GET polyfill.js

Creates a polyfill bundle based on the client's user agent.
See [polyfills/polyfills](https://github.com/polyfills/polyfills) for more details.

### Normalization

Packages are "normalized" based on these JSON files in descending priority.

1. `component.json`
2. `package.json`

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

[proxy]: https://github.com/normalize/proxy.js
