# Basil.js

The missing Javascript smart persistence layer.
Unified localstorage, cookie and session storage JavaScript API.


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
basil.set('foo', 'bar', { 'storage': 'local' });

// Access native storages
// With basil API, but without namespace nor JSON parsing for values

// cookies
basil.cookie.get(key);
basil.cookie.set(key, value, { 'expireDays': days, 'domain': 'mydomain.com' });

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
  // Namespace. Namespace your Basil stored data
  // default: 'b45i1'
  namespace: 'foo',

  // storages. Specify all Basil supported storages and priority order
  // default: `['local', 'cookie', 'session', 'memory']`
  storages: ['cookie', 'local']

  // storage. Specify the default storage to use
  // default: detect best available storage among the supported ones
  storage: 'cookie'

  // expireDays. Default number of days before cookies expiration
  // default: 365
  expireDays: 31

};
```

## Compatibility

- Firefox 3.5+
- Internet Explorer 7 (requires [json2.js](//cdnjs.cloudflare.com/ajax/libs/json2/20130526/json2.min.js]))
- Internet Explorer 8+
- Chrome 4+
- Safari 4+


## Plugins

### List plugin

This plugin mimics [Redis Lists](http://redis.io/commands#list) methods and
behaviors. Here are the (yet) supported methods.

```javascript
basil = new window.Basil(options);
basil.lindex(key, index);
basil.linsert(key, where, pivot, value);
basil.llen(key);
basil.lpop(key);
basil.lpush(key, value);
basil.lrange(key, start, stop);
basil.lrem(key, count, value);
basil.lset(key, index, value);
basil.ltrim(key, start, stop);
basil.rpop(key);
basil.rpush(key, value);
```

## Build

To generate the production files, make sure you have already installed the
dependencies using ````npm install```` and then just use:

````
npm run-script build
````

## Tests

To launch the test suite, make sure you have already installed the dependencies
using ````npm install````.
Tests are launching in all your installed browsers. They're also launched on
Travis CI, in PhantomJS.

````
npm test
npm run-script test-plugins
````

## License

MIT. See `LICENSE.md`
