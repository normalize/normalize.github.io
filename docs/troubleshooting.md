
### Normalization Logs

The normalization proxy will add logs to two places: `normalize-debug.log` and each file themselves.

#### normalize-debug.log

Each normalized repository will have a `normalize-debug.log`:

```
GET https://nlz.io/github/components/jquery/2.1.0/normalize-debug.log
```

This file will contain logs that pertain to the entire repository as a whole.

#### Per-file logs

Each file served from the proxy will include its own logs appended to the bottom of the file.
You can view these comments to see what the proxy did to the file.

### Debug

Whether you're using `nlz(1)` or run your own proxy,
you can set the `DEBUG` environmental variable to view the logs.
See [visionmedia/debug](https://github.com/visionmedia/debug) for more usage info.
In particular,
you want to do one of the following:

```bash
DEBUG=normalize*
DEBUG=normalize-proxy*
```

### Common Errors

#### EMFILE Errors

Normalize does __not__ have any concurrency control.
It executes everything as fast as possible in parallel.
What this means is that you could have a lot of file descriptors open at the same time.

Concurrency control is complex and unnecessary for build systems that don't require concurrency.
If you're hitting `EMFILE` errors,
then all you have to do is set your `ulimit` higher:

```bash
ulimit -n 10000
```

There's no reason you should have low limits in development.
