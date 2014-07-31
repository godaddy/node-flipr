'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

flipr.preload(function(){
  console.log('Config file is loaded and cached!');
});