# Basil changelog

## 0.4.4

  - check third party cookies if not inside a top window
  - support string, number, boolean or array as key

## 0.4.3

  - [BC Break] `_toStoredKey()` is now using '.' separator instead of ':' (#35)

## 0.4.2

  - [BC Break] Encode and decode cookie value on set and get (#30, #35)

## 0.4.1

  - Added HTTPS cookie option (#27)

## 0.4.0

  - Updated README
  - Added `keys()` and `keysMap()` methods (#24)
  - fixed cookie/localStorage security error if cookies disabled
  - [BC Break] Basil raw storage engines do not need now a basil instance
    to be accessed. Use `Basil.cookie.set('foo', 'bar')` now instead of
    `new Basil().cookie.set('foo', 'bar')`
