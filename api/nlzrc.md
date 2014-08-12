
`.nlzrc` is an optional JSON configuration file for local environments.
It's completely optional.
You may have a global, `.nlzrc` configuration for your computer as well as local `.nlzrc` configuration for each app.
For example, you might want to point all your requests to a proxy on your network instead of https://nlz.io.

### .proxy and .self-signed

```json
{
  "proxy": "localhost:8888",
  "self-signed": true
}
```

This is to set a custom proxy other than https://nlz.io.
`proxy` should be the full host, including the port.
Set `self-signed` to `true` if the proxy is using a self-signed certification,
otherwise an error will be thrown.
Remember, proxies must always use SSL.

### .directory = "repositories"

```json
{
  "directory": "/User/jong/.repositories"
}
```

By default, all files are stored to `process.cwd() + '/repositories'`.
Thus, every app or component you work on will have its own `directory` folder.
This may be less than ideal for you as you'll have multiple copies.

You may optionally set this directory to a global directory like `~/.repositories`
so that every app or component you work on share the same files.
It will also make installations a little faster.

### .entrypoints

The entry points for the build.
This allows you to not specify the entry points every time you run `nlz build(1)`.

```json
{
  "entrypoints": ["client/index.js", "client/index.css"]
}
```

You may also use objects if you want to set custom options on each entry point:

```json
{
  "entrypoints": {
    "client/index.js": {

    },
    "client/index.css": {

    }
  }
}
```

### .manifest = "normalize-manifest.json"

This allows you to use a custom `normalize-manifest.json` file name.

### .minifiedLength = true

Option whether to include each file's minified length in the manifest.
This takes a long time to calculate,
so is only recommended when you do `--watch`.
Set to `false` if you never want to calculate this.
