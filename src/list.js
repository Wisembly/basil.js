(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['basil.js'], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory(require( './basil.js')); // Node
  } else {
    factory(window.Basil); // Browser global
  }
}(function (Basil) {
  BasilList = function (options) {
    return new Basil.utils.extend(Basil.Storage().init(options), Basil.List(options));
  };

  Basil.List = function () {
    return {
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

        if (i < 0)
          i = list.length + i;

        return list[i] || null;
      },
      linsert: function (key, where, pivot, value) {
        var
          index = -1,
          list = this.get(key) || [],
          clone = [];

        if ('string' !== typeof value && 'number' !== typeof value)
          throw new Error('supported values are only strings and numbers');

        if ('BEFORE' !== where && 'AFTER' !== where)
          throw new Error('AFTER|BEFORE');

        for (var i = 0; i < list.length; i++) {
          if (pivot === list[i]) {
            index = i;
            break;
          }
        }

        if (-1 === index)
          return index;

        list.splice('BEFORE' === where ? i - 1 : i, 0, value);
        this.set(key, clone);

        return list.length;
      },
      llen: function (key) {
        return (this.get(key) || []).length;
      },
      lpop: function (key) {
        var
          list = this.get(key) || [],
          value = list.shift();
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
        throw new Error('not implemented yet');
      },
      lset: function (key, index, value) {
        var list = this.get(key) || [];

        if (index < 0)
          index = list.length + i;

        if (index < 0 || index >= list.length)
          throw new Error("ERR index out of range");

        list[index] = value;
        return 'OK';
      },
      ltrim: function (key, start, stop) {
        throw new Error('not implemented yet');
      },
      rpop: function (key) {
        var
          list = this.get(key) || [],
          value = list.pop();
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

  window.Basil = BasilList;

  // AMD export
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return BasilList;
    });
  // commonjs export
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = BasilList;
  }

}));
