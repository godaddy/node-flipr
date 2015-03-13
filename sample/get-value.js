'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  source: require('./config/basic-source'),
});

flipr.getValue('someNestedConfig', function(err, value){
  if(err)
    return void console.log(err);
  console.dir(value);
});

