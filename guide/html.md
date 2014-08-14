
### Only use web components in a SPDY environment

Normalize does not support creating bundles with web components.
Doing so in an unopinionated manner is very difficult.
Instead, you should only use web components with a SPDY push server
(or allow your users to suffer the latency).
