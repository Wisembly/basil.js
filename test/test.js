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
        expect(basil.supportedStorages).to.eql(['cookie']);
      });
      it('should handle storage option', function () {
        var basil = new window.Basil({storages: ['cookie']});
        expect(basil.defaultStorage).to.be('cookie');
      });
    });

    if (new window.Basil().localStorage.check()) {
      describe('localStorage', function () {
        var _localStorage;

        beforeEach(function () {
          _localStorage = window.localStorage;
        });
        it('should have check() method returning true if localStorage available', function () {
          expect(new window.Basil().localStorage.check()).to.be(true);
        });
        it('should have check() method returning false if localStorage not available 1/2', function () {
          window.localStorage.setItem = function () {
            throw new Error('not supported');
          };
          expect(new window.Basil().localStorage.check()).to.be(false);
        });
        it('should have check() method returning false if localStorage not available 2/2', function () {
          window.localStorage.removeItem = function () {
            throw new Error('not supported');
          };
          expect(new window.Basil().localStorage.check()).to.be(false);
        });
        it('should have set() method storing properly items and values 1/2', function () {
          window.localStorage.setItem = function () {
            expect(arguments[0]).to.be('foo');
            expect(arguments[1]).to.be('bar');
          };
          new Basil().localStorage.set('foo', 'bar');
        });
        it('should have set() method storing properly items and values 2/2', function () {
          expect(new Basil().localStorage.set()).to.be(undefined);
        });
        afterEach(function () {
          window.localStorage = _localStorage;
        });
      });
    } else {
      describe.skip('localStorage', function () {});
    }

	});
}());
