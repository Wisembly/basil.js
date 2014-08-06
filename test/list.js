(function () {

	describe('Basil List test suite', function () {
		var basil = new window.Basil();

		beforeEach(function () {
			basil.set('key', ['foo', 'bar']);
		});
		it('should have Basil List plugin loaded', function () {
			expect(basil._listPlugin).to.be(true);
		});
		it.skip('should have blpop method');
		it.skip('should have brpop method');
		it.skip('should have brpoplpush method');
		it('should have lindex method', function () {
			expect(basil.lindex('key', -42)).to.be(null);
			expect(basil.lindex('key', -1)).to.be('bar');
			expect(basil.lindex('key', 0)).to.be('foo');
			expect(basil.lindex('key', 1)).to.be('bar');
			expect(basil.lindex('key', 42)).to.be(null);
		});
		it('should have linsert method', function () {
			expect(basil.linsert('key', 'AFTER', 'foo', 'baz')).to.be(3);
			expect(basil.get('key')).to.be.eql(['foo', 'baz', 'bar']);

			try {
				basil.linsert('key', 'bar');
				expect().fail("should not pass");
			} catch (e) {
				expect(e.message).to.be('AFTER|BEFORE');
			}

			try {
				basil.linsert('key', 'AFTER');
				expect().fail("should not pass");
			} catch (e) {
				expect(e.message).to.be('supported values are only strings and numbers');
			}

			expect(basil.linsert('key', 'BEFORE', 'foo', 'bux')).to.be(4);
			expect(basil.get('key')).to.be.eql(['bux', 'foo', 'baz', 'bar']);
		});
		it('should have llen method', function () {
			expect(basil.llen('key')).to.be(2);
			basil.set('key', []);
			expect(basil.llen('key')).to.be(0);
		});
		it('should have lpop method', function () {
			expect(basil.lpop('key')).to.be('foo');
			expect(basil.llen('key')).to.be(1);
			expect(basil.lpop('key')).to.be('bar');
			expect(basil.get('key')).to.be(null); // verify that key is well deleted if empty
		});
		it('should have lpush method', function () {
			expect(basil.lpush('key', 'baz')).to.be(3);
			expect(basil.get('key')).to.eql(['baz', 'foo', 'bar']);
		});
		it.skip('should have lpushx method');
		it('should have lrange method', function () {
			basil.rpush('key', 'baz');
			expect(basil.lrange('key', 0, 0)).to.eql(['foo']);
			expect(basil.lrange('key', 1, 1)).to.eql(['bar']);
			expect(basil.lrange('key', 2, 2)).to.eql(['baz']);
			expect(basil.lrange('key', 0, 2)).to.eql(['foo', 'bar', 'baz']);
			expect(basil.lrange('key', 0, 100)).to.eql(['foo', 'bar', 'baz']);
			expect(basil.lrange('key', -100, 100)).to.eql(['foo', 'bar', 'baz']);
			expect(basil.lrange('key', 5, 10)).to.eql([]);
		});
		it.skip('should have lrem method');
		it('should have lset method', function () {
			try {
				basil.lset('donotexist', 0, 'foo');
				expect.tail("should not pass");
			} catch (e) {
				expect(e.message).to.be('ERR no such key');
			}

			try {
				basil.lset('key', 2, 'baz');
				expect().fail("should not pass");
			} catch (e) {
				expect(e.message).to.be('ERR index out of range');
			}
			expect(basil.lset('key', 1, 'baz')).to.be('OK');
			expect(basil.lset('key', -2, 'bux')).to.be('OK');
			expect(basil.lrange('key', 0, 2)).to.eql(['bux', 'baz']);
		});
		it.skip('should have ltrim method');
		it('should have rpop method', function () {
			expect(basil.rpop('key')).to.be('bar');
			expect(basil.llen('key')).to.be(1);
			expect(basil.rpop('key')).to.be('foo');
			expect(basil.llen('key')).to.be(0);
			expect(basil.get('key')).to.be(null); // verify that key is well deleted if empty
		});
		it.skip('should have brpoplpush method');
		it('should have rpush method', function () {
			expect(basil.rpush('key', 'baz')).to.be(3);
			expect(basil.lindex('key', 2)).to.be('baz');
		});
		it.skip('should have rpushx method');
		afterEach(function () {
			basil.set('key', []);
		});
	});

}());
