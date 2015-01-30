# Basil changelog

## 4.0.0

  - Updated README
  - Added `keys()` and `keysMap()` methods (#24)
  - fixed cookie/localStorage security error if cookies disabled
  - [BC Break] Basil raw storage engines do not need now a basil instance
    to be accessed. Use `Basil.cookie.set('foo', 'bar')` now instead of
    `new Basil().cookie.set('foo', 'bar')`
