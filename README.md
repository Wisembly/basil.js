# Basil.js

The missing Javascript smart persistant layer


## Basic Usage

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


## Advanced Usage

```javascript
basil = new window.Basil(options);

// force storage on the go through basil
// set 'bar' value under 'foo' key in localStorage
basil.set('foo', 'bar', 'local');

// Access native storages
// With basil API, but without namespace nor JSON parsing for values

// cookies
basil.cookie.get(key);
basil.cookie.set(key, value, days);

// localStorage
basil.localStorage.get(key);
basil.localStorage.set(key, value);

// sessionStorage
basil.sessionStorage.get(key);
basil.sessionStorage.set(key, value);
```


## Configuration

Here is the whole `options` object that you could give to Basil:

```javascript
options = {
  // Namespace. Namespace you Basil stored data
  // default: 'b45i1'
  namespace: 'foo',

  // Type. Specify a Basil supported storage
  // default: detect best available storage among the supported ones
  // `['local', 'cookie', 'sessions', 'memory']`
  type: 'cookie'
};
```

## Build

To generate the production files, make sure you already installed the dependencies using ````npm install```` and then just use:

````
npm run-script build
````

## Tests

To launch the test suite, make sure you already installed the dependecies using ````npm-install````.
Tests are launching in all your installed browsers. They're also launched on Travis CI, in PhantomJS.

````
npm test
````

## License

MIT. See `LICENSE.md`
