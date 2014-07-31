'use strict';

var flipr = require('../lib/flipr');

flipr.init({
  folderPath: 'sample/config/',
  fileName: 'feature-flipping.yaml',
  //rules execute in the order they are defined.
  //if a match is found by a rule,
  //the rest of the rules will be ignored for
  //that config item.
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
    },
    {
      type: 'equal',
      //This property won't exist on the sample 
      //inputs below.  So this rule will be ignored.
      input: 'user.notUserId',
      property: 'notUsed'
    }
  ]
});

var sampleInput1 = {
  user: {
    userId: '30048'
  }
};
var sampleInput2 = {
  user: {
    userId: '2tm'
  }
};

//This shows what % a user's id falls under
//when calculating config values based on %
console.log('sampleInput1.user.userId % ' + flipr.idToPercent(sampleInput1.user.userId));
console.log('sampleInput2.user.userId % ' + flipr.idToPercent(sampleInput2.user.userId));

flipr(sampleInput1, function(err, config){
  if(err)
    return void console.dir(err);
  console.log('Config for sampleInput1:');
  console.dir(config);
});

flipr(sampleInput2, function(err, config){
  if(err)
    return void console.dir(err);
  console.log('Config for sampleInput2:');
  console.dir(config);
});