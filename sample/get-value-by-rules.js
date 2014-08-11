'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  source: require('./config/feature-flipping-source'),
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

var input = {user:{userId:'2tm'}};

flipr.getValueByRules(input, 'welcomeMessage', function(err, value){
  if(err)
    return void console.log(err);
  console.dir(value);
});