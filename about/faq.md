
### Will Normalize.IO support node.js?

Normalize.IO is specifically tailored for frontend development.
In particular, node modules are refactored to work for the browser,
sacrificing node compatibility in the process.

Instead, we weill most likely make a similar tool for node.js,
but it may not be the same name or in the same utility.

### Can I omit `http:` or `https://` from the URLs?

If browsers support protocol-less URLs, then so will we.
However, there are a couple potential issues with omitting protocols.

1. It's more difficult to differentiate between URLs and local/relative assets.
2. Some browsers plan to not support non-SSL SPDY, so this might not even work in development.
