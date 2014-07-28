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
	});
}());
