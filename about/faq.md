
### How will you make money?

Currently, Normalize.IO is being developed as a build process for my own app.
Thus, only features I use will be actively developed by my own free will.

For long term support, you should [gittip me](https://www.gittip.com/jonathanong/) as hosting costs are at least $100 a year,
half of which is just the domain name.
If tipped, I'll be inclined to work on features I don't use.

For business and enterprise features,
you'll probably want to set a bounties via [bountysource](https://www.bountysource.com/) or contact me directly for paid support.
All my code is open source, so I personally don't have a need for these types of features, but I believe these are eventually necessary.

If Normalize.IO takes off, I'd like to create a "proxy as a service" much like nodejitsu's private npm servers,
but I wouldn't want to do it myself since I have no interest in dev ops.

I'm particularly interested in corporate sponsorships,
particularly the first CDN that could provide SPDY Push support.

### Will Normalize.IO support node.js?

Hopefully, node.js will eventually support https://nlz.io without a client with ES6 modules.
But supporting node.js with a command line interface is difficult as there are many obstacles to overcome.
Basically, forking node would be required to make it work gracefully, which is in the realm of possibility.

To keep yourself up to date with node.js support,
follow the [node-normalize](https://github.com/normalize/node-normalize) repository.

### Can I omit `https://` from the URLs?

If browsers support protocol-less URLs, then so will we.
However, there are a couple potential issues with omitting protocols.

1. It's more difficult to differentiate between URLs and local/relative assets.
2. Some browsers plan to not support non-SSL SPDY, so this might even work in development.
