(function () {
	describe('Basil test suite', function () {

		describe('General API', function () {
			it('should be defined', function () {
				expect(window.Basil).to.be.a('function');
			});
			it('should be instanciable', function () {
				expect(window.Basil()).to.be.an('object');
			});
			it('should have a valid unified API', function () {
				var basil = new window.Basil();
				expect(basil.init).to.be.a('function');
				expect(basil.setOptions).to.be.a('function');
				expect(basil.support).to.be.a('function');
				expect(basil.check).to.be.a('function');
				expect(basil.get).to.be.a('function');
				expect(basil.set).to.be.a('function');
				expect(basil.remove).to.be.a('function');
				expect(basil.reset).to.be.a('function');
				expect(basil.keys).to.be.a('function');
				expect(basil.keysMap).to.be.a('function');
			});
			it('should allow access to native storages', function () {
				expect(Basil.memory).to.be.an('object');
				expect(Basil.cookie).to.be.an('object');
				expect(Basil.localStorage).to.be.an('object');
				expect(Basil.sessionStorage).to.be.an('object');
			});
		});

		describe('Options handling', function () {
			it('should handle storages option', function () {
				var basil = new window.Basil({ storages: ['cookie'] });
				expect(basil.options.storages).to.eql(['cookie']);
			});
			it('should handle namespace option', function () {
				var basil = new window.Basil({ namespace: 'foo' });
				expect(basil.options.namespace).to.be('foo');
			});
		});

		describe('Functional Tests', function () {
			var data = {
					str: 'hello world',
					nb: 42,
					obj: { foo: 'bar', baz: 'quux' },
					arr: ['foo', 42, 'bar']
				},
				alt = {
					str: 'foobar',
					nb: -1,
					obj: { hello: 'world', foo: 'bar' },
					arr: ['quux', -1, 'baz']
				};

			it('should be able to set data', function () {
				var basil = new window.Basil();
				for (var key in data) {
					basil.set(key, data[key]);
					expect(basil.get(key)).to.eql(data[key]);
				}
			});
			it('should be able to set data of a given namespace and retrieve it', function () {
				var basil = new window.Basil();
				for (var key in alt) {
					basil.set(key, alt[key], { namespace: 'alt' });
					expect(basil.get(key, { namespace: 'alt' })).to.eql(alt[key]);
					expect(basil.get(key)).to.eql(data[key]);
				}
			});
			it('should be able to remove data of a given namespace', function () {
				var basil = new window.Basil();
				for (var key in alt) {
					basil.remove(key, { namespace: 'alt' });
					expect(basil.get(key)).to.eql(data[key]);
					expect(basil.get(key, { namespace: 'alt' })).to.be(null);
				}
			});
			it('should be able to remove data', function () {
				var basil = new window.Basil();
				for (var key in data) {
					basil.remove(key);
					expect(basil.get(key)).to.be(null);
				}
			});
			it('should be able to reset all data', function () {
				var basil = new window.Basil();
				for (var key in data)
					basil.set(key, data[key]);
				basil.reset();
				for (var key in data)
					expect(basil.get(key)).to.be(null);
			});
			it('should be able to reset all data of a given namespace', function () {
				var basil = new window.Basil();
				for (var key in alt) {
					basil.set(key, alt[key], { namespace: 'alt' });
					basil.set(key, data[key]);
				}
				basil.reset({ namespace: 'alt' });
				for (var key in alt) {
					expect(basil.get(key)).to.eql(data[key]);
					expect(basil.get(key, { namespace: 'alt' })).to.be(null);
				}
				basil.reset();
			});
			it('should be able to define a key from an array of string', function () {
				var basil = new window.Basil();
				basil.set(['hello', 'world'], 'bar');
				expect(basil.get(['hello', 'world'])).to.eql('bar');

				basil.set(['foo', '', 'bar'], 'baz');
				expect(basil.get('foo.bar')).to.eql('baz');

				basil.remove(['foo', 'bar']);
				expect(basil.get('foo.bar')).to.be(null);

				basil.reset();
			});
			it('should be able to define a key from a mixed array', function () {
				var basil = new window.Basil();
				basil.set(['hello', 42, 'world', false], 'foobar');
				expect(basil.get(['hello', 42, 'world', false])).to.eql('foobar');

				basil.set(['foo', null, 'bar', '', 18], 'quux');
				expect(basil.get('foo.bar.18')).to.eql('quux');

				basil.remove(['foo', null, 'bar', '', 18], 'quux');
				expect(basil.get('foo.bar.18')).to.be(null);

				basil.reset();
			});
			it('should be able to define a key from a number', function () {
				var basil = new window.Basil();
				basil.set(42, 'foo');
				expect(basil.get(42)).to.eql('foo');

				basil.remove(42);
				expect(basil.get(42)).to.be(null);

				basil.set(1234, 'hello world');
				expect(basil.get('1234')).to.eql('hello world');

				basil.reset();
			});
			it('should be able to define a key from a boolean', function () {
				var basil = new window.Basil();

				basil.set(true, 'bar');
				expect(basil.get(true)).to.eql('bar');

				basil.remove(true);
				expect(basil.get(true)).to.be(null);

				basil.set(false, 'baz');
				expect(basil.get('false')).to.eql('baz');

				basil.remove('false');
				expect(basil.get(false)).to.be(null);

				basil.reset();
			});
			it('should be able to get all the keys', function() {
				var basil = new window.Basil();
				basil.set('foo', 'i am local', { storages: ['local'] });
				basil.set('foo', 'i am session', { storages: ['session'] });
				basil.set('bar', 'i am cookie and session', { storages: ['cookie', 'session'] });
				basil.set('baz', 'i am session', { storages: ['session'] });
				expect(basil.keys()).to.eql(['foo', 'bar', 'baz']);
				expect(basil.keysMap()).to.eql({
					'foo': ['local', 'session'],
					'bar': ['cookie'],
					'baz': ['session']
				});
				basil.reset();
			});
			it('should be able to get all the keys of a given namespace', function() {
				var basil = new window.Basil();
				basil.options.namespace = 'first';
				basil.set('foo', 'i am local with namespace `first`', { storages: ['local'] });
				basil.set('foo', 'i am session with namespace `first`', { storages: ['session'] });
				basil.options.namespace = 'second';
				basil.set('bar', 'i am cookie and session with namespace `second`', { storages: ['cookie', 'session'] });
				basil.set('baz', 'i am session with namespace `seconf`', { storages: ['session'] });
				basil.options.namespace = 'third';
				expect(basil.keys({ namespace: 'first' })).to.eql(['foo']);
				expect(basil.keysMap({ namespace: 'first' })).to.eql({
					'foo': ['local', 'session'],
				});
				expect(basil.keys({ namespace: 'second' })).to.eql(['bar', 'baz']);
				expect(basil.keysMap({ namespace: 'second' })).to.eql({
					'bar': ['cookie'],
					'baz': ['session']
				});
				expect(basil.keys({ namespace: 'third' })).to.eql([]);
				expect(basil.keysMap({ namespace: 'third' })).to.eql({});
				basil.reset({ namespace: 'first' });
				basil.reset({ namespace: 'second' });
				basil.reset({ namespace: 'third' });
			});
		});

		if (window.Basil.cookie.check()) {
			describe('cookie storage', function() {
				it('can set and get keys with special characters', function() {
					Basil.cookie.set('hello;world', 42);
					expect(Basil.cookie.get('hello;world')).to.eql(42);
				});
				it('can set and get values with special characters', function() {
					Basil.cookie.set('helloworld', 'test;one,two three');
					expect(Basil.cookie.get('helloworld')).to.eql('test;one,two three');
				});
			});
		}

		if (window.Basil.localStorage.check()) {
			describe('localStorage', function () {
				var _engine = {
					setItem: function () {},
					removeItem: function () {}
				};
				it('should have check() method returning true if localStorage available', function () {
					expect(window.Basil.localStorage.check()).to.be(true);
				});
				it('should have check() method returning false if localStorage not available 1/2', function () {
					var stub = sinon.stub(_engine, 'setItem');
					stub.throws();
					Basil.localStorage.engine = _engine;
					expect(Basil.localStorage.check()).to.be(false);
					stub.restore();
				});
				it('should have check() method returning false if localStorage not available 2/2', function () {
					var stub = sinon.stub(_engine, 'removeItem');
					stub.throws();
					Basil.localStorage.engine = _engine;
					expect(Basil.localStorage.check()).to.be(false);
					stub.restore();
				});
				it('should have set() method storing properly items and values 1/2', function () {
					var stub = sinon.stub(_engine, 'setItem');
					Basil.localStorage.set('foo', 'bar');
					expect(stub.calledWith('foo', 'bar'));
					stub.restore();
				});
				it('should have set() method storing properly items and values 2/2', function () {
					expect(Basil.localStorage.set()).to.be(undefined);
				});
			});
		} else {
			describe.skip('localStorage', function () {});
		}

	});
}());
