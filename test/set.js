(function () {

	describe('Basil Set test suite', function () {
		var basil = new window.Basil();

		it('should have Basil Set plugin loaded', function () {
			expect(basil._setPlugin).to.be(true);
		});

		it('should have sadd method', function () {
			basil.sadd('basil_set', ['foo', 'bar']);
			expect(basil.smembers('basil_set')).to.eql(['foo', 'bar']);
			var addItem = basil.sadd('basil_set', 'baz');
			expect(addItem).to.be(1);
			expect(basil.smembers('basil_set')).to.eql(['foo', 'bar', 'baz']);
		});

		it('should not add duplicate elements', function () {
			basil.sadd('basil_set', ['foo', 'bar']);
			basil.sadd('basil_set', ['bar', 'baz']);
			expect(basil.smembers('basil_set')).to.eql(['foo', 'bar', 'baz']);
		});

		it('should have scard method', function() {
    		expect(basil.scard('basil_set')).to.be(0);
    		basil.sadd('basil_set', ['foo', 'bar']);
    		expect(basil.scard('basil_set')).to.be(2);
		});

		it('should have sdiff method', function() {
    		var array1 = ['a', 'b', 'c', 'd'], array2 = ['c'],
    			array3 = ['a', 'c', 'e'];

    		basil.sadd('basil_set_1', array1);
    		basil.sadd('basil_set_2', array2);
    		basil.sadd('basil_set_3', array3);

    		expect(basil.sdiff('basil_set_1', 'basil_set_2', 'basil_set_3')).to.eql(['b', 'd']);

    		basil.remove('basil_set_1');
    		basil.remove('basil_set_2');
    		basil.remove('basil_set_3');
		});

		it('should have sdiffstore method', function() {
			var array1 = ['a', 'b', 'c', 'd'], array2 = ['c'],
				array3 = ['a', 'c', 'e'];

			basil.sadd('basil_set_1', array1);
			basil.sadd('basil_set_2', array2);
			basil.sadd('basil_set_3', array3);

			var result = basil.sdiffstore('basil_diff_set', 'basil_set_1', 'basil_set_2', 'basil_set_3');
			expect(result).to.be(2);
			expect(basil.smembers('basil_diff_set')).to.eql(['b', 'd']);

			basil.remove('basil_diff_set');
			basil.remove('basil_set_1');
			basil.remove('basil_set_2');
			basil.remove('basil_set_3');
		});

		it('should have sinter method', function() {
    		var array1 = ['a', 'b', 'c', 'd'], array2 = ['c'],
				array3 = ['a', 'c', 'e'];

    		basil.sadd('basil_set_1', array1);
    		basil.sadd('basil_set_2', array2);
    		basil.sadd('basil_set_3', array3);

    		expect(basil.sinter('basil_set_1', 'basil_set_2', 'basil_set_3')).to.eql(['c']);

    		basil.remove('basil_set_1');
    		basil.remove('basil_set_2');
    		basil.remove('basil_set_3');
		});

		it('should have sinterstore method', function() {
    		var array1 = ['a', 'b', 'c', 'd'], array2 = ['c'],
				array3 = ['a', 'c', 'e'];

    		basil.sadd('basil_set_1', array1);
    		basil.sadd('basil_set_2', array2);
    		basil.sadd('basil_set_3', array3);

    		var result = basil.sinterstore('basil_intersect_set', 'basil_set_1', 'basil_set_2', 'basil_set_3');
    		expect(result).to.be(1);
    		expect(basil.smembers('basil_intersect_set')).to.eql(['c']);

    		basil.remove('basil_intersect_set');
    		basil.remove('basil_set_1');
    		basil.remove('basil_set_2');
    		basil.remove('basil_set_3');
		});

		it('should have sismember menthod', function() {
			basil.sadd('basil_set', ['foo', 'bar']);
			expect(basil.sismember('basil_set', 'foo')).to.be(1);
			expect(basil.sismember('basil_set', 'baz')).to.be(0);
		});

		it('should have smember menthod', function() {
			basil.sadd('basil_set', ['foo', 'bar']);
			expect(basil.smembers('basil_set')).to.eql(['foo', 'bar']);
			expect(basil.smembers('basil_set_2')).to.eql([]);
		});

		it('should have smove menthod', function() {
			basil.sadd('basil_set', ['foo', 'bar']);
			var result = basil.smove('basil_set', 'basil_set_2', 'bar');

			expect(result).to.be(1);
			expect(basil.smembers('basil_set')).to.eql(['foo']);
			expect(basil.smembers('basil_set_2')).to.eql(['bar']);

			result = basil.smove('basil_set', 'basil_set_2', 'foo');

			expect(result).to.be(1);
			expect(basil.smembers('basil_set')).to.eql([]);
			expect(basil.smembers('basil_set_2')).to.eql(['bar', 'foo']);

			result = basil.smove('basil_set', 'basil_set_2', 'foo');

			expect(result).to.be(0);

			basil.remove('basil_set');
			basil.remove('basil_set_2')
		});

		it('should have spop method', function() {
			var array = ['foo', 'bar', 'baz'];
			basil.sadd('basil_set', array);
			var result = basil.spop('basil_set');
			expect(array).to.contain(result);
			expect(basil.smembers('basil_set').length).to.be(2);
			basil.spop('basil_set');
			basil.spop('basil_set');
			result = basil.spop('basil_set');
			expect(result).to.be(null);
		});

		it('should have srandmember method', function() {
			var array = ['foo', 'bar', 'baz', 'qux', 'quux'];
			basil.sadd('basil_set', array);
			var result = basil.srandmember('basil_set');
			expect(array).to.contain(result);
			expect(basil.smembers('basil_set').length).to.be(5);

			result = basil.srandmember('basil_set', 3);
			expect(result).to.be.an(Array);
			expect(result.length).to.be(3);

			result = basil.srandmember('basil_set', 8);
			expect(result).to.be.an(Array);
			expect(result.length).to.be(5);

			result = basil.srandmember('basil_set', -8);
			expect(result).to.be.an(Array);
			expect(result.length).to.be(8);
		});

		it('should have srem method', function() {
			var array = ['foo', 'bar', 'baz', 'qux', 'quux'];
			basil.sadd('basil_set', array);

			var result = basil.srem('basil_set', 'baz');
			expect(result).to.be(1);
			expect(basil.smembers('basil_set')).to.eql(['foo', 'bar', 'qux', 'quux']);

			result = basil.srem('basil_set', ['baz', 'foo', 'quux']);
			expect(result).to.be(2);
			expect(basil.smembers('basil_set')).to.eql(['bar', 'qux']);

			basil.remove('basil_set');
			result = basil.srem('basil_set', 'baz');
			expect(result).to.be(0);
		});

		it('should have sunion method', function() {
			var array1 = ['a', 'b', 'c', 'd'], array2 = ['c'],
				array3 = ['a', 'c', 'e'];

			basil.sadd('basil_set_1', array1);
			basil.sadd('basil_set_2', array2);
			basil.sadd('basil_set_3', array3);

			expect(basil.sunion('basil_set_1', 'basil_set_2', 'basil_set_3')).to.eql(['a', 'b', 'c', 'd', 'e']);

			basil.remove('basil_set_1');
			basil.remove('basil_set_2');
			basil.remove('basil_set_3');
		});

		it('should have sunionstore method', function() {
			var array1 = ['a', 'b', 'c', 'd'], array2 = ['c'],
				array3 = ['a', 'c', 'e'];

			basil.sadd('basil_set_1', array1);
			basil.sadd('basil_set_2', array2);
			basil.sadd('basil_set_3', array3);

			var result = basil.sunionstore('basil_union_set', 'basil_set_1', 'basil_set_2', 'basil_set_3');
			expect(result).to.be(5);
			expect(basil.smembers('basil_union_set')).to.eql(['a', 'b', 'c', 'd', 'e']);

			basil.remove('basil_union_set');
			basil.remove('basil_set_1');
			basil.remove('basil_set_2');
			basil.remove('basil_set_3');
		});


        afterEach(function () {
			basil.remove('basil_set');
		});
	});

}());
