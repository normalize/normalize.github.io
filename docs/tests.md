
One of the goals of Normalize is to make testing easier.
Currently, a lot of CLI tools and integrations with various services are required to test web components well.

> Note: This is not currently implemented and is merely a brainstorm. This is open for discussion.

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
module Component from 'index.js'

describe('My Component', function () {
  // ... tests
})

// or simply import other tests
import 'test/this.js'
import 'test/that.js'
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

### Running tests from https://nlz.io

As a build process is required to build the tests locally,
Normalize will automatically `nlz build test.js test.html` on the server for maximum browser support.
This will make testing browser components easier as you can simply open the `test.html` file in any browser you'd like:

```bash
open https://nlz.io/github/me/my-component/1.0.5/test.html
```

When Normalize supports commit SHAs, adding CI support will much simpler.
There won't be a need to create custom build processes to test your components.
Just create git hooks to open the commit SHA's tests in different browsers.

### Scaffolding

It would be really annoying to create `test.html` in every component.
Thus, one of the goals of https://nlz.io is to automatically generate `test.html` if there's a `test.js`.
For example, if `mocha` is detected as the test runner,
an HTML document with `<div id="mocha"></div>` and the mocha stylesheet would be created automatically at the proxy.
