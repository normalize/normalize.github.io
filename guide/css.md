
### Best Practices

#### Don't do crazy @imports

Stick with simple `@import` statements.
`@import` statements using `url()`s and media queries are not supported.
Instead of using `@import`s with media queries,
just use each as separate entry points and use `<link>` tags with media queries.

#### @import liberally

`@import`ing the same CSS file multiple does not include it multiple in the build,
nor does it create multiple HTTP requests.
What it does do, however, is guarantee ordering.
All CSS files `@import`ed within a CSS file will be included before the the rest of the CSS file's rules.

#### Prepend relative URLs with ./ if it contains a `@`

For example, if you have:

```css
background-image: url('images/logo@2x.png')
```

Normalize might think that this is a remote dependency.
To avoid this confusion, just prepend it with a `./`:

```css
background-image: url('./images/logo@2x.png')
```
