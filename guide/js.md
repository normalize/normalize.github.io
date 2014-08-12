
### Best Practices

#### Use index.js for browsers, node.js for node.js

Give browsers filename priority. Specify `.main = 'node.js'` and `.browser = 'index.js'` in your `package.json`s.
