
Typing `https://nlz.io/` everywhere becomes tedious quickly,
so Normalize allows you to use shorthands for dependencies.
Shorthands simply expand to the long Normalize URLs.
However, due to the wide remote support Normalize provides,
shorthands require a certain degree of specificity.

However, shorthands can only be used if either:

1. You use a build process, `nlz build`
2. You use a Normalizer server such as `koa-normalize`
3. You use a custom client-side ES6 module loader

Thus, shorthands are second-class citizens.
Normalize will eventually provide a custom module loader for these shorthands.

### The Law of Shorthands

1. Do not use shorthands in CSS and HTML as they do not allow custom loaders.
2. Do not use shorthands in libraries,
  only applications where you can expect a custom module loader to be used.
  Creating libraries with shorthands is too vendor-specific.
  URLs should always work in any environment!
3. `@` is used for versions and commits. Do __not__ use `#`.

### Shorthands

#### Extensions

Files that end with `/` expand to `/index.js`:

```
emitter@1/lib/ => /npm/-/emitter/1/lib/index.js
```

Files that do not end with `.js` simply have `.js` appended:

```
emitter@1/index => /npm/-/emitter/1/index.js
```

#### npm

`<module>@<version>/<file...>` resolves to `https://nlz.io/npm/-/<module>/<version>/<file...>`:

```
emitter@1 => /npm/-/emitter/1/index.js
emitter@1/ => /npm/-/emitter/1/index.js
emitter@1/something => /npm/-/emitter/1/something.js
```

Namespaces are prefixed with `@<org>`,
i.e. `@<org>/<module>@<version>/<file...>`:

```
@nlz/emitter@1 => /npm/nlz/emitter/1/index.js
@nlz/emitter@1/ => /npm/nlz/emitter/1/index.js
@nlz/emitter@1/something => /npm/nlz/emitter/1/something.js
```

When prefixed with `@org`, the `@<version>` is optional:

```
@nlz/emitter => /npm/nlz/emitter/*/index.js
@nlz/emitter/ => /npm/nlz/emitter/*/index.js
@nlz/emitter/something => /npm/nlz/emitter/*/something.js
```

npm shorthands may always be prefixed with `npm:`:

```
npm:emitter@1 => /npm/-/emitter/1/index.js
```

#### GitHub

`<user>/<project>@<version>/<file...>` resolves to `https://nlz.io/<user>/<project>/<version>/<file...>`:

```
component/emitter@1 => /component/emitter/1/index.js
component/emitter@1/lib => /component/emitter/1/lib/index.js
```

Note that `@<version>` here is required for the shorthand,
otherwise it could be a file.

#### Everything Else

All other remotes can be abbreviated to:

```
<remote>:<user>/<project>@<version>/<file...>
```

Where:

- `remote` is the remote name or alias.
- `user` is optional if the remote has a global namespace (i.e. `npm`)
- `project` - the name of the project/module/package
- `version` - is optional, defaulting to `*`
- `file` - can be completely empty, defaulting to `/index.js`

Some remotes, such as npm, have or will have namespaces.
However, it will be treated as if it does not as most modules do not use namespaces.
As you can see from above, npm modules have a custom shorthand syntax due to this pecularity.
