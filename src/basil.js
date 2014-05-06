(function () {
	var Basil = window.Basil = function (options) {
		return new window.Basil.Storage().init(options);
	};

	Basil.version = '0.1.25';

	Basil.Storage = function () {
		var _namespace = function () {
				var options = this.options || {};
				return (options.namespace || 'b45i1') + ':';
			},
			_detect = function (type) {
				var types = type ? [type] : ['local', 'cookie', 'sessions', 'memory'],
					available = null;
				for (var i = 0; !available && i < types.length; i++) {
					available = this.check(types[i]) ? types[i] : null;
				}
				return available;
			},
			_toStoredKey = function (name) {
				var key = '',
					namespace = _namespace.call(this);
				if (typeof name === 'string')
					key = namespace + name;
				else if (name instanceof Array) {
					for (var i = 0; i < name.length; i++)
						if (name[i])
							key += (key.length ? ':' : namespace) + name[i];
				}
				return key;
			},
			_toStoredValue = function (value) {
				return JSON.stringify(value);
			},
			_fromStoredValue = function (value) {
				return JSON.parse(value);
			},
			_storages = {
				local: {
					check: function () {
						try {
							window.localStorage.setItem('__xyz__', true);
							window.localStorage.removeItem('__xyz__');
						} catch (e) {
							return false;
						}
						return true;
					},
					set: function (name, value) {
						if (!name)
							return;
						try {
							window.localStorage.setItem(name, value);
						} catch (e) {
							if (e == QUOTA_EXCEEDED_ERR && window.console)
								window.console.error('localStorage: Quota exceeded');
							throw(e);
						}
					},
					get: function (name) {
						return window.localStorage.getItem(name);
					},
					remove: function (name) {
						window.localStorage.removeItem(name);
					},
					reset: function () {
						var namespace = _namespace.call(this);
						for (var key, i = 0; i < window.localStorage.length; i++) {
							key = window.localStorage.key(i);
							if (key.indexOf(namespace) === 0)
								this.remove(key);
						}
					}
				},
				session: {
					check: function () {
						try {
							window.sessionStorage.setItem('__xyz__', true);
							window.sessionStorage.removeItem('__xyz__');
						} catch (e) {
							return false;
						}
						return true;
					},
					set: function (name, value) {
						if (!name)
							return;
						try {
							window.sessionStorage.setItem(name, value);
						} catch (e) {
							if (e == QUOTA_EXCEEDED_ERR && window.console)
								window.console.error('localStorage: Quota exceeded');
							throw(e);
						}
					},
					get: function (name) {
						return window.sessionStorage.getItem(name);
					},
					remove: function (name) {
						window.sessionStorage.removeItem(name);
					},
					reset: function () {
						var namespace = _namespace.call(this);
						for (var key in window.sessionStorage) {
							if (key.indexOf(namespace) === 0)
								this.remove(key);
						}
					}
				},
				memory: {
					_hash: {},
					check: function () {
						return true;
					},
					set: function (name, value) {
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
					reset: function () {
						var namespace = _namespace.call(this);
						for (var key in this._hash) {
							if (key.indexOf(namespace) === 0)
								this.remove(key);
						}
					}
				},
				cookie: {
					check: function () {
						return navigator.cookieEnabled;
					},
					set: function (name, value, days) {
						if (!name)
							return;
						var expires = '';
						if (days) {
							var date = new Date();
							date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
							expires = '; expires=' + date.toGMTString();
						}
						document.cookie = name + '=' + value + expires + '; path=/';
					},
					get: function (name) {
						var cookies = document.cookie.split(';');

						for (var i = 0; i < cookies.length; i++) {
							var cookie = cookies[i].replace(/^\s*/, '');
							if (cookie.indexOf(name + '=') === 0)
								return cookie.substring(name.length + 1, cookie.length);
						}
						return null;
					},
					remove: function (name) {
						if (!name)
							return;
						this.set(name, '', -1);
					},
					reset: function () {
						var namespace = _namespace.call(this),
							cookies = document.cookie.split(';');

						for (var i = 0; i < cookies.length; i++) {
							var cookie = cookies[i].replace(/^\s*/, ''),
								key = cookie.substr(0, cookie.indexOf('='));
							if (key.indexOf(namespace) === 0)
								this.remove(key);
						}
					}
				}
			};

		return {
			init: function (options) {
				this.options = options || {};
				this.type = _detect.call(this, this.options.type);
				return this;
			},
			check: function (type) {
				type = type || this.type;
				if (_storages.hasOwnProperty(type))
					return _storages[type].check();
				return false;
			},
			set: function (name, value, type, days) {
				name = _toStoredKey.call(this, name);
				if (!name || !this.check(type))
					return;
				return _storages[type || this.type].set(name, _toStoredValue(value), days || 365);
			},
			get: function (name, type) {
				name = _toStoredKey.call(this, name);
				if (!name || !this.check(type))
					return;
				return _fromStoredValue.call(this, _storages[type || this.type].get(name));
			},
			remove: function (name, type) {
				name = _toStoredKey.call(this, name);
				if (!name || !this.check(type))
					return;
				_storages[type || this.type].remove(name);
			},
			reset: function (type) {
				if (!this.check(type))
					return;
				_storages[type || this.type].reset();
			},
			// Access to native storages, without namespace or basil value decoration
			cookie: _storages.cookie,
			localStorage: _storages.local,
			sessionStorage: _storages.session
		};
	};
})();
