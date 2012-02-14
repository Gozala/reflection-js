# reflection #

I don't know about you, but I'm tired of writing:

```js
Array.prototype.slice.call(arguments, 1)

// or

Object.prototype.hasOwnProperty(object, 'foo')
```

This simple library allows you to do the same in less chatty way (Specially
useful when working with promises).

```js
var reflection = require('reflection/core')

reflection.slice(arguments, 2)
reflection.owns(object, 'foo')
reflection.split('foo bar baz', ' ')

```

## Install ##

    npm install reflection

