## v1.1.0 (April 6, 2015)

Features:

  - Added another shorthand notation to the flipr function.  `flipr(someInput, 'someKey', cb)` is now equivalent to `flipr.getValueByRules(someInput, 'someKey', cb)`.  This was done to promote usage of getValueByRules, which is much more performant for large configs.


## v1.0.0 (March 12, 2015)

Flipr, now with sources!

Features:

  - Refactored flipr to use sources.
  - Initial sources are yaml and etcd.
