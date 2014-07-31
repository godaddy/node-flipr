'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

flipr.preload(function(){
  console.log('Config file has been read and cached.  Any changes to the .yaml file will not be read by flipr.');

  flipr.flush();

  console.log('Cache has been flushed. The next call to flipr will result in the file being read and cached again.');
});