
### Don't comment out dependencies

Currently, for speed, Normalize uses regular expressions
to find all the dependencies of a CSS or JS file.
The problem with this is that it will still catch
any dependencies within comments, which can't easily be removed with regexps.
For example, these dependencies will all be captured:

```js
// import 'x'
// require('x')
/* import 'x' */
```

```css
/* @import 'test.css'; */
```

The reason it's difficult to strip out comments
is because Normalize supports dependencies of the form:

```js
import 'https://github/component/emitter/*/index.js';
```

And the `/*/` in the URL confuses a lot of parsers and
makes stripping comments difficult.

The solution is to actually parse the AST for dependencies,
which may be added in the future as long as performance
is not too degraded.
