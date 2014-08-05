(function () {

  describe('Basil List test suite', function () {
    it('should have Basil List plugin loaded', function () {
      var basil = new window.Basil();
      expect(basil._listPlugin).to.be(true);
    });
    it.skip('should have blpop method');
    it.skip('should have brpop method');
    it.skip('should have brpoplpush method');
    it('should have lindex method', function () {
      var basil = new window.Basil();
      basil.set('foo', ['foo', 'bar']);
      expect(basil.lindex('foo', -42)).to.be(null);
      expect(basil.lindex('foo', -1)).to.be('bar');
      expect(basil.lindex('foo', 0)).to.be('foo');
      expect(basil.lindex('foo', 1)).to.be('bar');
      expect(basil.lindex('foo', 42)).to.be(null);
    });
    it('should have linsert method', function () {
      var basil = new window.Basil();
      basil.set('foo', ['foo', 'bar']);
      expect(basil.linsert('foo', 'AFTER', 'foo', 'baz')).to.be(3);
      expect(basil.get('foo')).to.be.eql(['foo', 'baz', 'bar']);

      try {
        basil.linsert('foo', 'bar');
        expect(true).to.be(false);
      } catch (e) {
        expect(e.message).to.be('AFTER|BEFORE');
      }

      try {
        basil.linsert('foo', 'AFTER');
        expect(true).to.be(false);
      } catch (e) {
        expect(e.message).to.be('supported values are only strings and numbers');
      }

      expect(basil.linsert('foo', 'BEFORE', 'foo', 'bux')).to.be(4);
      expect(basil.get('foo')).to.be.eql(['bux', 'foo', 'baz', 'bar']);
    });
    it.skip('should have llen method');
    it.skip('should have lpop method');
    it.skip('should have lpush method');
    it.skip('should have lpushx method');
    it.skip('should have lrange method');
    it.skip('should have lrem method');
    it.skip('should have lset method');
    it.skip('should have ltrim method');
    it.skip('should have rpop method');
    it.skip('should have brpoplpush method');
    it.skip('should have rpush method');
    it.skip('should have rpushx method');
  });

}());
