
One of the goals of Normalize is to make testing easier.
Currently, a lot of CLI tools and integrations with various services are required to test web components well.

### Tests will simply be another entry point

Currently, tests are run through CLI utilities such as `mocha` with many options passed:

```bash
mocha --reporter spec --require should --bail --timeout 10s test/*.js
```

Instead, Normalized components should have pure JS entry points for tests:

```js
// get mocha and should globally
import 'https://nlz.io/github/visionmedia/mocha/1/index.js'
import 'https://nlz.io/github/visionmedia/should.js/3/index.js'

// set the test options
mocha.setup('bdd')
mocha.bail()
mocha.reporter('spec')
mocha.timeout('10s')

// include tests within this file
import Component from 'index'

describe('My Component', function () {
  // ... tests
})

// or simply import other tests
import 'test/this'
import 'test/that'
```

Locally, in node.js environments, running `node test.js` should be sufficient.
However, some build process might be necessary, so for the near future, it'll look like:

```bash
nlz build test.js
node build/test.js
```

### Running tests in browsers

The above test is only applicable to pure JS modules.
Ideally, we should be able to run tests in browsers,
but browsers require `.html` documents.
With `test.js` created above,
users should simply create `test.html` that references `test.js`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Component</title>
    <link rel="stylesheet" href="https://nlz.io/github/visionmedia/mocha/1/index.css">
  </head>
  <body>
    <p>These are the tests!</p>
    <div id="mocha"></div>
    <script src="test.js"></script>
  </body>
</html>
```

Thus, simply `open test.html` __should__ run the tests, eventually.
Your test may include additional files such as custom CSS.
For now, we're going to need a build process to run the tests locally:

```bash
nlz build test.html
open build/test.html
```
