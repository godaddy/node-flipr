'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

flipr(function(err, config){
  if(err)
    return void console.dir(err);
  console.dir(config);
});