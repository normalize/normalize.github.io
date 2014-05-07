
https://nlz.io is __NOT__ ready to be used as a CDN in production.
You may still use it as a registry and proxy for `nlz(1)`,
but serving files from https://nlz.io is not recommended.

The following criteria must be met before it is ready for production usage:

- A CDN that supports SPDY Push must be used. We're not going to setup a complex infrastructure to make this work (like npm).
- Browsers must support SPDY
- Browsers must support URLs in ES6 module `import` statements
- Browsers must support `<link rel="import" href="">` tags
