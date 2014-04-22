# Basil.js

The missing Javascript smart persistant layer

# Basic Usage

```javascript
basil = new window.Basil(options);

// basic methods
basil.set('foo', 'bar'); // store 'bar' value under 'foo' key
basil.get('foo'); // returns 'bar'
basil.remove('foo'); // remove 'foo' value

// advanced methods
basil.check('local'); // boolean. Test if localStorage is available
basil.reset(); // reset all stored values under namespace for current storage
```

# Configuration

Here is the whole `options` object that you could give to Basil:

```javascript
options = {
  // Namespace. Namespace you Basil stored data
  // default: 'b45i1', set `false` or `null` if you don't want namespace
  namespace: 'foo',

  // Type. Specify a Basil supported storage
  // default: detect best available storage among the supported ones
  // `['local', 'cookie', 'sessions', 'memory']`
  type: 'cookie'
};
```
