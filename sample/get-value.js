'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  folderPath: 'sample/config/',
  fileName: 'basic.yaml'
});

flipr.getValue('someNestedConfig', function(err, value){
  if(err)
    return void console.log(err);
  console.dir(value);
});

