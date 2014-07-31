'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  folderPath: 'sample/config/',
  fileName: 'feature-flipping.yaml',
  rules: [
    {
      type: 'equal',
      input: function(input){
        return input.user.userId === '2tm';
      },
      property: 'isUserSpecial'
    },
    {
      type: 'list',
      //You can use strings to access deep properties
      input: 'user.userId',
      property: 'userIds'
    },
    {
      type: 'percent',
      input: 'user.userId'
    }
  ]
});

var input = { user: { userId: '121212' } };

//In feature-flipping.yaml, welcomeMessage is set up with a default
//value, which will be selected if the userId doesn't match the other
//values.
flipr.getValueByRules(input, 'welcomeMessage', function(err, value){
  if(err)
    return void console.dir(err);
  console.log(value);
});