
Normalize.IO was born out of frustration with the current web development workflow.
It has a very specific philosophy,
which will affect its development.

Wondering if Normalize.IO should add a feature?
If it complies with these tenets, then let us know!
Otherwise, don't bother.

### Back to the Basics

The web development stack should be as short as possible.
This means no unnecessary abstractions or opinions and just use what WC3, WHATWG, and ES has given us.
Things like LESS, CoffeeScript, and Grunt are second-class citizens.
Of course, this was impossible until recently as `<link rel="import">` and `import "index.js"` were only added recently.

Let's not try to build the ideal stack of `npm + browserify + less + rework-npm + gulp + yeoman`, etc.
We should strive towards __no stack__ using only features browsers (will) support,
and at most 1 tool, `nlz` or anything similar, as a stopgap until browsers get us there.

### Specification Compliant

Normalize.IO will strive to comply with specifications from the web authorities,
particularly ECMAScript, WHATWG, and WC3.
Specifications like CommonJS, AMD, and UMD are completely irrelevant and are only used as stopgaps for the true specifications.

Thus, you may see features such as [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) and [regenerator](http://facebook.github.io/regenerator/) automatically included, acting like polyfills.
But you will not see features such as [@extend](https://github.com/reworkcss/rework-inherit) make it unless they are added to the specifications, even as a draft.

### Opt-In Everything

Many build systems such as `grunt`, `gulp`, `broccoli`, `browserify`, and `component` have a lot of possible plugins and configuration options.
However, these have become a bane for web development as now users have to install tens of modules just to get their app running
as well as figure out how to configure all these plugins to work with each other with giant configuration scripts.
Developers would also have to write plugins for every time of platform,
creating what I call "module pollution".

The Normalize.IO philosophy is the opposite - it should include all plugins that 99% of web developers use,
allowing most to be able to just simply `nlz build --watch` their component or app and call it a day.
Eventually, they should be able to skip `nlz` and simply `open webpage.html`.
Bootstrapping apps and components should not be complicated.

This means that Normalize.IO will push out those 1% of developers who want something very specific and most likely outside of specifications.
If this 1% wishes to use Normalize.IO, they would have to essentially create their own proxy and client to do so.
Otherwise, they could use the many other build tools at their disposal.

### Normalize Web Development

Aside from the top three tenets,
the idea behind Normalize.IO is to "normalize" or "standardize" web development.
We want to keep features specification compliant and (cognitive) overhead minimal.

But of course, this means normalizing and standardizing how apps and components are built and structured.
This is the primary concept behind `entrypoints` such as `index.js`, `test.js`, `README`, etc.
People should know what to expect from a "normal" app/module/component.

### 1-to-1 Transformations

One of the most complicated type of transform are many-to-1 transforms.
For example, concatenating all your SCSS files, then converting it to a single CSS file.
However there are many wrong with this philosophy.

Normalize.IO will only support 1-to-1 transformations except for a few cases,
with caveats, such as CSS Variables, since it is specification-compliant.

#### File Interdependence

The only dependencies files should have upon each other are those defined by specifications such as `@import`.
Anything else is too opinionated for Normalize.IO.
With CSS preprocessors, this may be necessary when using mixins, variables, etc.,
but you should instead strive towards specifications such as [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).

#### No Incremental Builds

Only supporting 1-to-1 transformations allow very fast build times through incremental builds.
`nlz` uses `make`-like 1-to-1 transforms and only rebuilds what has changed.
When you have many-to-one transforms, 1 line change would require a full rebuild.
The difference is a `x * 100ms` vs. `< 100ms` build times,
especially with CSS preprocessors such as Stylus and SASS.

#### No Complicated Build Process

Many build tools such as `grunt`, `gulp`, and `broccoli` were created out of a need to support these types of transforms.
In the end, you create very complex build processes and configuration options,
all of which is unnecessary and not specification-compliant.
