# Basil.js

The missing Javascript smart persistence layer.
Unified localstorage, cookie and session storage JavaScript API.


## Philosophy

Basil aims to ease the frontend storage management for developers. It strives
to be bulletproof and handle disabled cookies, full localStorage and other
unwanted native storage exceptions..

When you try to store something, basil will automatically look through all
the available storage mechanisms and find the best suited one to store your value. It
also handles storage of complex javascript objects using json.


## Basic Usage

```javascript
basil = new window.Basil(options);

// basic methods
basil.set('foo', 'bar'); // store 'bar' value under 'foo' key
basil.set('abc', 'xyz'); // store 'xyz' value under 'abc' key
basil.get('foo'); // returns 'bar'
basil.keys(); // returns ['abc', 'foo']
basil.keysMap(); // returns { 'abc': ['local'], 'foo': ['local'] }
basil.remove('foo'); // remove 'foo' value

// advanced methods
basil.check('local'); // boolean. Test if localStorage is available
basil.reset(); // reset all stored values under namespace
```

## Advanced Usage

### Storages

```javascript
basil = new window.Basil(options);

// force storage on the go through basil
// set 'bar' value under 'foo' key in localStorage
basil.set('foo', 'bar', { 'storages': ['local'] });

// set 'bar' value under 'foo' key.
// try first to store it into cookies and if not possible into localStorage
basil.set('foo', 'quux', { 'storages': ['cookie', 'local'] });

// set 'xyz' value under 'abc' key in memory
basil.set('abc', 'xyz', { 'storages': ['memory'] });

// set value without JSON encoding
basil.set('foo', '{ "bar": "baz" }', { raw: true }); // will save { "bar": "baz" } as string

// retrieve keys
basil.keys(); // returns ['foo', 'abc']
basil.keys({ 'storages': ['memory'] }); // returns ['abc']

// retrieve keys map
basil.keysMap(); // returns { 'foo': ['local', 'cookie'], 'abc': ['memory'] }
basil.keysMap({ 'storages': ['memory'] }); // returns { 'abc': ['memory'] }
```

### Native storages
```
// Access native storages
// With basil API, but without namespace nor JSON parsing for values

// cookies
Basil.cookie.get(key);
Basil.cookie.set(key, value, { 'expireDays': days, 'domain': 'mydomain.com', 'secure': true });

// localStorage
Basil.localStorage.get(key);
Basil.localStorage.set(key, value);

// sessionStorage
Basil.sessionStorage.get(key);
Basil.sessionStorage.set(key, value);
```

### Namespaces

```javascript
basil = new window.Basil(options);

// store data under default namespace
basil.set('hello', 'world');

// store data under a given namespace
basil.set('hello', 42, { 'namespace': 'alt' });
basil.set('abc', 'def', { 'namespace': 'alt', 'storages': ['memory'] });

// retrieve data
basil.get('hello'); // return 'world'
basil.get('hello', { 'namespace': 'alt' }); // return 42

// retrieves keys
basil.keys(); // returns ['hello']
basil.keys({ 'namespace': 'alt' }); // returns ['hello', 'abc']

// retrieves  keys map
basil.keysMap(); // returns { 'hello': ['local'] }
basil.keysMap({ 'namespace': 'alt' }); // returns { 'hello': ['local'], 'abc': ['memory'] }

// remove data under a given namespace
basil.remove('hello', { 'namespace': 'alt' });
basil.get('hello'); // return 'world'
basil.get('hello', { 'namespace': 'alt' }); // return null

// reset data under a given namespace
basil.reset({ 'namespace': 'alt', 'storages': ['local', 'memory']});
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

### Set plugin

This plugin mimics [Redis Sets](http://redis.io/commands#set) methods and
behaviors. Except sscan all the methods are implemented.

```javascript
basil = new window.Basil(options);
basil.sadd(key, member [members ...]);
basil.scard(key);
basil.sdiff(key [keys ...]);
basil.sdiffstore(destination, key [keys ...]);
basil.sinter(key [keys ...]);
basil.sinterstore(destination, key [keys ...]);
basil.sismember(key, member);
basil.smember(key);
basil.smove(source, destination, member);
basil.spop(key);
basil.srandmember(key, [count]);
basil.srem(key, member [members ...]);
basil.sunion(key [keys ...]);
basil.sunionstore(destination, key [keys ...]);
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
