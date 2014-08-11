'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  source: require('./config/basic-source')
});

flipr(function(err, config){
  if(err)
    return void console.dir(err);
  console.dir(config);
});