# nlz.io

This is the landing and documentation page for https://nlz.io as well as http://normalize.github.io (static version).
Of course, this uses [nlz](https://github.com/normalize/nlz) to build the site.

## Setting up

Until https://nlz.io is launched, you need to setup the proxy locally:

```bash
git clone git://github.com/normalize/proxy.js
cd proxy.js
export PORT=8888
npm start
```

Notice how this `.nlzrc` file has the port `8888` set as well.
Feel free to change it in both places.

Then install `nlz` with `npm i -g nlz`.
Personally, I would just clone and link the repository because `nlz` is probably going to change a lot for now.

```bash
git clone git://github.com/normalize/nlz
cd nlz
npm link
```

To build the JS and CSS, run the following:

```bash
nlz build --watch
```

Notice how the entry points are defined within `.nlzrc`.

Then to build the pages, run `make`.
