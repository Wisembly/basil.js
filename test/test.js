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
				expect(basil.detect).to.be.a('function');
				expect(basil.check).to.be.a('function');
				expect(basil.get).to.be.a('function');
				expect(basil.set).to.be.a('function');
				expect(basil.remove).to.be.a('function');
				expect(basil.reset).to.be.a('function');
			});
			it('should allow access to native storages', function () {
				var basil = new window.Basil();
				expect(basil.cookie).to.be.an('object');
				expect(basil.localStorage).to.be.an('object');
				expect(basil.sessionStorage).to.be.an('object');
			});
		});

		describe('Options handling', function () {
			it('should handle storages option', function () {
				var basil = new window.Basil({storages: ['cookie']});
				expect(basil.supportedStorages).to.have.key(['cookie']);
			});
			it('should handle storage option', function () {
				var basil = new window.Basil({storages: ['cookie']});
				expect(basil.defaultStorage).to.be('cookie');
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
			it('should be able to get all the keys', function() {
				var basil = new window.Basil();
				basil.set('foo', 'i am local', { storages: ['local'] });
				basil.set('foo', 'i am session', { storages: ['session'] });
				basil.set('bar', 'i am cookie and session', { storages: ['cookie', 'session'] });
				basil.set('baz', 'i am session', { storages: ['session'] });
				expect(basil.keys()).to.eql(['foo', 'bar', 'baz']);
				expect(basil.keysMap()).to.eql({
					'foo': ['local', 'session'],
					'bar': ['cookie', 'session'],
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
					'bar': ['cookie', 'session'],
					'baz': ['session']
				});
				expect(basil.keys({ namespace: 'third' })).to.eql([]);
				expect(basil.keysMap({ namespace: 'third' })).to.eql({});
				basil.reset({ namespace: 'first' });
				basil.reset({ namespace: 'second' });
				basil.reset({ namespace: 'third' });
			});
		});

		if (new window.Basil().localStorage.check()) {
			describe('localStorage', function () {
				var _engine = {
					setItem: function () {},
					removeItem: function () {}
				};
				it('should have check() method returning true if localStorage available', function () {
					expect(new window.Basil().localStorage.check()).to.be(true);
				});
				it('should have check() method returning false if localStorage not available 1/2', function () {
					var basil = new window.Basil(),
						stub = sinon.stub(_engine, 'setItem');
					stub.throws();
					basil.localStorage.engine = _engine;
					expect(basil.localStorage.check()).to.be(false);
					stub.restore();
				});
				it('should have check() method returning false if localStorage not available 2/2', function () {
					var basil = new window.Basil(),
						stub = sinon.stub(_engine, 'removeItem');
					stub.throws();
					basil.localStorage.engine = _engine;
					expect(basil.localStorage.check()).to.be(false);
					stub.restore();
				});
				it('should have set() method storing properly items and values 1/2', function () {
					var basil = new window.Basil(),
						stub = sinon.stub(_engine, 'setItem');
					basil.localStorage.set('foo', 'bar');
					expect(stub.calledWith('foo', 'bar'));
					stub.restore();
				});
				it('should have set() method storing properly items and values 2/2', function () {
					expect(new Basil().localStorage.set()).to.be(undefined);
				});
			});
		} else {
			describe.skip('localStorage', function () {});
		}

	});
}());
