'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  source: require('./config/flushable-source'),
});

flipr.flush();

console.log('All cached/memoized values have been flushed. The next call to flipr will get a fresh config from the source (assuming the flush is a synchronous action in the source).');