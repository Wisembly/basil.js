(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['basil.js'], factory); // AMD
	} else if (typeof exports === 'object') {
		module.exports = factory(require( './basil.js')); // Node
	} else {
		factory(window.Basil); // Browser global
	}
}(function (Basil) {

	var BasilList = function () {
		var _toIndex = function (index, length) {
			if (index < 0)
				index = length + index;

			if (index < 0 || index >= length)
				throw new Error("ERR index out of range");

			return index;
		};

		return {
			_listPlugin: true,
			blpop: function () {
				throw new Error('not implemented yet');
			},
			brpop: function () {
				throw new Error('not implemented yet');
			},
			brpoplpush: function (source, destination) {
				throw new Error('not implemented yet');
			},
			lindex: function (key, index) {
				var list = this.get(key) || [];

				try {
					index = _toIndex(index, list.length);
				} catch (e) {
					return null;
				}

				return list[index];
			},
			linsert: function (key, where, pivot, value) {
				var index = -1,
					list = this.get(key) || [];

				if (0 === list.length)
					return 0;

				if ('undefined' === typeof value || 'undefined' === typeof pivot)
					throw new Error('ERR wrong number of arguments for \'linsert\' command');

				if ('BEFORE' !== where && 'AFTER' !== where)
					throw new Error('ERR syntax error');

				// added here for Basil, even if objects are supported
				// we do not support (yet?) object comparison, too heavy
				if ('number' !== typeof pivot && 'string' !== typeof pivot)
					throw new Error('ERR syntax error');

				for (var i = 0; i < list.length; i++) {
					if (pivot === list[i]) {
						index = i;
						break;
					}
				}

				if (-1 === index)
					return index;

				list.splice('AFTER' === where ? i - 1 : i, 0, value);
				this.set(key, list);

				return list.length;
			},
			llen: function (key) {
				return (this.get(key) || []).length;
			},
			lpop: function (key) {
				var list = this.get(key) || [],
					value = list.shift();

				if (0 === list.length)
					this.remove(key);
				else
					this.set(key, list);

				return value || null;
			},
			lpush: function (key, value) {
				var list = this.get(key) || [];
				list.unshift(value);
				this.set(key, list);

				return list.length;
			},
			lpushx: function (key, value) {
				throw new Error('not implemented yet');
			},
			lrange: function (key, start, stop) {
				var list = this.get(key) || [];

				if (-1 === stop)
					return list.slice(start);

				return list.slice(start, stop + 1);
			},
			lrem: function (key, count, value) {
				if ('undefined' === typeof count || 'undefined' === typeof value)
					throw new Error('ERR wrong number of arguments for \'lrem\' command');

				var list = this.get(key) || [];

				if (0 === list.length)
					return 0;

				// added here for Basil, even if objects are supported
				// we to not support (yet?) object comparison, too heavy
				if ('number' !== typeof value && 'string' !== typeof value)
					throw new Error('ERR syntax error');

				var index = count >= 0 ? 0 : list.length - 1,
					length = list.length,
					iteration = 0,
					removed = 0;

				// iterate on whole list or stop if we found exactly the right count occurences
				while (iteration < length && (0 === count || (0 !== count && removed !== Math.abs(count)))) {

					if (value === list[index]) {
						list.splice(index, 1);
						removed++;

						// we removed an element, we need to decrease index if we are
						// looping from 0 to length otherwise we'll skip some values..
						if (count >= 0)
							index--;
					}

					iteration++;
					count >= 0 ? index++ : index--;
				}

				if (0 === list.length)
					this.remove(key);
				else
					this.set(key, list);

				return removed;
			},
			lset: function (key, index, value) {
				var list = this.get(key) || [];

				if (0 === list.length)
					throw new Error('ERR no such key');

				index = _toIndex(index, list.length);
				list[index] = value;
				this.set(key, list);

				return 'OK';
			},
			ltrim: function (key, start, stop) {
				throw new Error('not implemented yet');
			},
			rpop: function (key) {
				var list = this.get(key) || [],
					value = list.pop();

				if (0 === list.length)
					this.remove(key);
				else
					this.set(key, list);

				return value || null;
			},
			rpoplpush: function (source, destination) {
				throw new Error('not implemented yet');
			},
			rpush: function (key, value) {
				var list = this.get(key) || [];
				list.push(value);
				this.set(key, list);

				return list.length;
			},
			rpushx: function (key, value) {
				throw new Error('not implemented yet');
			}
		};
	};

	Basil.utils.registerPlugin(new BasilList());
}));
