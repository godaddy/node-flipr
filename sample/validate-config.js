'use strict';

var flipr = require('../lib/flipr');

flipr.init();

flipr.validateConfig({
  folderPath: 'sample/config/',
  fileName: 'validate-config.yaml',
  rules: [
    {
      type: 'equal',
      input: 'foo',
      property: 'someFlag'
    },
    {
      type: 'list',
      input: 'foo',
      property: 'userIds'
    },
    {
      type: 'percent',
      input: 'foo'
    }
  ]
}, function(err, errors){
  //'err' will be populated with an error that indicates
  //validation failed for some unexpected reason.
  //'errors' will either be undefined if no errors were encountered
  //or it will be an array of Error objects.
  if(err) {
    console.log('Unexpected error encountered during validation');
    return void console.dir(err);
  }
  if(errors) {
    console.log('Config is invalid!  See errors below.');
    return void console.dir(errors);
  }
  console.log('No errors encountered, the config is valid!');
});