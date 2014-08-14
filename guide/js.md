
### Best Practices

#### Use index.js for browsers, node.js for node.js

Give browsers filename priority. Specify `.main = 'node.js'` and `.browser = 'index.js'` in your `package.json`s.

#### Don't inline dependencies with their own dependencies

Specifically, don't do this:

```js
import css from 'style.css';

var style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);
```

Where `style.css` is:

```css
@import 'another-style.css';
```

This is relevant with all dependency types, including HTML and CSS.
Normalize currently does not handle rewriting these URLs,
mostly because it doesn't know how to change the dependency
after it's already been converted to JS.
If you have suggestions on how to solve this, please let us know!
