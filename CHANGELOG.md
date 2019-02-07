## v2.1.0 (February 7th, 2019)

### Features & Improvements

- Added three new rules: includes, includesListAny, and includesListAll
- Updated docs and tests

### Bug Fixes

- Fixed a case sensitivity bug in the rules

## v2.0.0 (January 28th, 2019)

### Features & Improvements

- ES6+ Rewrite
- Now supports async/await
- Lots of cleanup and prep work for more features
- `jest` for testing
- `eslint` for linting

### Breaking Changes

- Default export is now a `Flipr` class
- async/await replaces callbacks everywhere
- Removed input validator
- Removed connect middleware
- Renamed `getDictionary` and `getDictionaryByRules` to `getConfig`
- Renamed `getValueByRules` to `getValue`
- `preload` and `flush` are now `async` and required on all sources
- `init` replaced with class constructor
- Removed a lot of unnecessary function parameter validation
- `getValue` and `getConfig` will return undefined for dynamic config keys if no input is given
- Removed memoization of getValue and getConfig, just relying on source caching now
- Drop support for node < v8.3
- Flipr sources must now support async/await
- Dropped support for the existing flipr-etcd source, that will need a rewrite.

## v1.1.0 (April 6, 2015)

Features:

  - Added another shorthand notation to the flipr function.  `flipr(someInput, 'someKey', cb)` is now equivalent to `flipr.getValueByRules(someInput, 'someKey', cb)`.  This was done to promote usage of getValueByRules, which is much more performant for large configs.


## v1.0.0 (March 12, 2015)

Flipr, now with sources!

Features:

  - Refactored flipr to use sources.
  - Initial sources are yaml and etcd.
