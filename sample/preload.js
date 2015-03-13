'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  source: require('./config/preload-source')
});

flipr.preload(function(){
  console.log('Config has been loaded and cached!');
});