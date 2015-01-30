(function () {
	// Basil
	var Basil = function (options) {
		return Basil.utils.extend(Basil.plugins, new Basil.Storage().init(options));
	};

	// Version
	Basil.version = '0.4.0';

	// Utils
	Basil.utils = {
		extend: function () {
			var destination = typeof arguments[0] === 'object' ? arguments[0] : {};
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i] && typeof arguments[i] === 'object')
					for (var property in arguments[i])
						destination[property] = arguments[i][property];
			}
			return destination;
		},
		each: function (obj, fnIterator, context) {
			if (this.isArray(obj)) {
				for (var i = 0; i < obj.length; i++)
					if (fnIterator.call(context, obj[i], i) === false) return;
			} else if (obj) {
				for (var key in obj)
					if (fnIterator.call(context, obj[key], key) === false) return;
			}
		},
		tryEach: function (obj, fnIterator, fnError, context) {
			this.each(obj, function (value, key) {
				try {
					return fnIterator.call(context, value, key);
				} catch (error) {
					if (this.isFunction(fnError)) {
						try {
							fnError.call(context, value, key, error);
						} catch (error) {}
					}
				}
			}, this);
		},
		registerPlugin: function (methods) {
			Basil.plugins = this.extend(methods, Basil.plugins);
		}
	};
  	// Add some isType methods: isArguments, isBoolean, isFunction, isString, isArray, isNumber, isDate, isRegExp.
	var types = ['Arguments', 'Boolean', 'Function', 'String', 'Array', 'Number', 'Date', 'RegExp']
	for (var i = 0; i < types.length; i++) {
		Basil.utils['is' + types[i]] = (function (type) {
			return function (obj) {
				return Object.prototype.toString.call(obj) === '[object ' + type + ']';
			};
		})(types[i]);
	}

	// Plugins
	Basil.plugins = {};

	// Options
	Basil.options = Basil.utils.extend({
		namespace: 'b45i1',
		storages: ['local', 'cookie', 'session', 'memory'],
		expireDays: 365
	}, window.Basil ? window.Basil.options : {});

	// Storage
	Basil.Storage = function () {
		var _salt = 'b45i1' + (Math.random() + 1)
				.toString(36)
				.substring(7),
			_storages = {},
			_toStoragesArray = function (storages) {
				if (Basil.utils.isArray(storages))
					return storages;
				return Basil.utils.isString(storages) ? [storages] : [];
			},
			_toStoredKey = function (namespace, path) {
				var key = '';
				if (Basil.utils.isString(path) && path.length)
					path = [path];
				if (Basil.utils.isArray(path) && path.length)
					key = path.join(':');
				return key && namespace ? namespace + ':' + key : key;
			},
			_toKeyName = function (namespace, name) {
				if (!namespace)
					return name;
				return name.replace(new RegExp('^' + namespace + ':'), '');
			},
			_toStoredValue = function (value) {
				return JSON.stringify(value);
			},
			_fromStoredValue = function (value) {
				return JSON.parse(value);
			};

		// HTML5 web storage interface
		var webStorageInterface = {
			engine: null,
			check: function () {
				try {
					window[this.engine].setItem(_salt, true);
					window[this.engine].removeItem(_salt);
				} catch (e) {
					return false;
				}
				return true;
			},
			set: function (name, value, options) {
				if (!name)
					return;
				window[this.engine].setItem(name, value);
			},
			get: function (name) {
				return window[this.engine].getItem(name);
			},
			remove: function (name) {
				window[this.engine].removeItem(name);
			},
			reset: function (namespace) {
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0) {
						this.remove(key);
						i--;
					}
				}
			},
			keys: function (namespace) {
				var keys = [];
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				}
				return keys;
			}
		};

		// local storage
		_storages.local = Basil.utils.extend({}, webStorageInterface, {
			engine: 'localStorage'
		});
		// session storage
		_storages.session = Basil.utils.extend({}, webStorageInterface, {
			engine: 'sessionStorage'
		});

		// memory storage
		_storages.memory = {
			_hash: {},
			check: function () {
				return true;
			},
			set: function (name, value, options) {
				if (!name)
					return;
				this._hash[name] = value;
			},
			get: function (name) {
				return this._hash[name] || null;
			},
			remove: function (name) {
				delete this._hash[name];
			},
			reset: function (namespace) {
				for (var key in this._hash) {
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace) {
				var keys = [];
				for (var key in this._hash)
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				return keys;
			}
		};

		// cookie storage
		_storages.cookie = {
			check: function () {
				return navigator.cookieEnabled;
			},
			set: function (name, value, options) {
				if (!this.check())
					throw 'SecurityError: cookies are disabled';
				options = options || {};
				if (!name)
					return;
				var cookie = name + '=' + value;
				if (options.expireDays) {
					var date = new Date();
					date.setTime(date.getTime() + (options.expireDays * 24 * 60 * 60 * 1000));
					cookie += '; expires=' + date.toGMTString();
				}
				if (options.domain)
					cookie += '; domain=' + options.domain;
				document.cookie = cookie + '; path=/';
			},
			get: function (name) {
				if (!this.check())
					throw 'SecurityError: cookies are disabled';
				var cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					if (cookie.indexOf(name + '=') === 0)
						return cookie.substring(name.length + 1, cookie.length);
				}
				return null;
			},
			remove: function (name) {
				if (!this.check())
					throw 'SecurityError: cookies are disabled';
				if (!name)
					return;
				// remove cookie from main domain
				this.set(name, '', { expireDays: -1 });

				// remove cookie from upper domains
				var domainParts = document.domain.split('.');
				for (var i = domainParts.length - 1; i > 0; i--) {
					this.set(name, '', { expireDays: -1, domain: '.' + domainParts.slice(- i).join('.') });
				}
			},
			reset: function (namespace) {
				if (!this.check())
					throw 'SecurityError: cookies are disabled';
				var cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = cookie.substr(0, cookie.indexOf('='));
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace) {
				if (!this.check())
					throw 'SecurityError: cookies are disabled';
				var keys = [],
					cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = cookie.substr(0, cookie.indexOf('='));
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key));
				}
				return keys;
			}
		};

		return {
			init: function (options) {
				this.setOptions(options);
				return this;
			},
			setOptions: function (options) {
				this.options = Basil.utils.extend({}, this.options || Basil.options, options);
			},
			support: function (storage) {
				return _storages.hasOwnProperty(storage);
			},
			check: function (storage) {
				if (this.support(storage))
					return _storages[storage].check();
				return false;
			},
			set: function (name, value, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(name = _toStoredKey(options.namespace, name)))
					return;
				value = _toStoredValue(value);
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].set(name, value, options);
					return false; // break;
				}, function (storage, index, error) {
					if (this.support(storage))
						_storages[storage].remove(name);
				}, this);
			},
			get: function (name, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(name = _toStoredKey(options.namespace, name)))
					return null;
				var value = null;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					if (value !== null)
						return false; // break
					if (this.support(storage))
						value = _fromStoredValue(_storages[storage].get(name, options));
				}, function (storage, index, error) {
					value = _storages[storage].get(name, options) || null;
				}, this);
				return value;
			},
			remove: function (name, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(name = _toStoredKey(options.namespace, name)))
					return null;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					if (this.support(storage))
						_storages[storage].remove(name);
				}, null, this);
			},
			reset: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					if (this.support(storage))
						_storages[storage].reset(options.namespace);
				}, null, this);
			},
			keys: function (options) {
				options = options || {};
				var keys = [];
				for (var key in this.keysMap(options))
					keys.push(key);
				return keys;
			},
			keysMap: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				var map = {};
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					if (!this.support(storage))
						return true; // continue
					Basil.utils.each(_storages[storage].keys(options.namespace), function (key) {
						map[key] = Basil.utils.isArray(map[key]) ? map[key] : [];
						map[key].push(storage);
					}, this);
				}, null, this);
				return map;
			},
			// Access to native storages, without namespace or basil value decoration
			memory: _storages.memory,
			cookie: _storages.cookie,
			localStorage: _storages.local,
			sessionStorage: _storages.session
		};
	};

	// browser export
	window.Basil = Basil;

	// AMD export
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return Basil;
		});
	// commonjs export
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Basil;
	}

})();
