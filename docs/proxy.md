
These are the specifications for https://nlz.io as well as any [normalize-proxy](https://github.com/normalize/proxy.js).

## URL Structure

URLs generally have the form: `https://nlz.io/<remote>/<user>/<project>/<version>/<file>`.
Obviously, different proxies will have different hostnames.

#### Protocol

Every proxy __must__ serve via HTTPS and SPDY/HTTPv2,
even with a self-signed certificate.

#### Remote

A supported remote's name, for example `github/`.

Aliases will also be supported and will simply redirect to the canonical short name.
For example, `github.com` and `raw.githubusercontent.com` would redirect to `github`.

#### User

If the remote does not have a namespace, the user should simply be `-`.

#### Project

The name of the project or module.

#### Version

Any version as defined by http://semver.org v2.0.0.
You should not include leading `v`s and `=` in single versions

Eventually, commit SHAs for `git` remotes will be supported.
However, branches will never be supported.

## Entry Points

The proxy will "normalize" various end points so that you can be assured that these files will always exist.
You may still reference only the original files.

- [x] `index.js` - for JS modules
- [x] `index.css` - for CSS modules
- [ ] `(index.html)?` - for Web Components. Simply omitting `index.html` and leaving a trailing `/` in the URL will work as well. Do not use this for anything but Web Components.
- [ ] `test.js` - standalone test script. Only suitable for JS modules. If exists, so will `test.html`.
- [ ] `test.html` - standalone test page. Suitable for any type of web project.
- [ ] `node.js` - an entry point specifically for `node.js`.
- [ ] `README` - the readme formatted as an HTML document.
- [ ] `LICENSE` - the LICENSE file formatted as an HTML document.

#### GET File

You may still `GET` files directly, even with transforms.
All of the files dependencies will be SPDY pushed to the client.

Each file can have the following query strings.
These are only valid when __exact__, so don't include a trailing `=`.
Only one query string can be used at a time:

- `?source` - return/redirect the source file and its dependencies all without any transformations applied. Useful for building server-side.
- `?min` - minify the transformation. Only applies to JS, CSS, and HTML assets.

If any of these query strings are included,
then all the pushed dependencies will also include the same query string.

Each file will have an `ETag` header which is the `sha256 sum` of the __source__ file.
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
If no versions are installed, then the latest version will automatically be installed.
A `404` and an empty array will be returned only when the module can not be installed.

If you pushed a new version of a package,
but the proxy has not installed it yet,
simply install it by hitting the `pull` entry point.

The semantics of this endpoint is subject to change.
In particular, it should return all available versions on the remote.

#### GET metadata.json

```
GET https://nlz.io/<remote>/<user>/<project>/metadata.json
```

Per-repository metadata that is not version-specific.
This is where you'll find metadata such as author, keywords, etc.

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

#### GET proxy.json

```js
GET https://nlz.io/proxy.json
```

Returns relevant information about the proxy including hostname, version, and supported remotes.
