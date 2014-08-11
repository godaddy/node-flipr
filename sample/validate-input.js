/**
* inputValidator is very useful when you're using the connect middleware.
* There may be certain requests that don't need a dynamic configuration.
* You can identify such requests in your inputValidator, causing flipr
* to skip grabbing the dynamic configuration and just return the static
* configuration.  However, if you call flipr.getDictionaryByRules
* explicitly, and you pass invalid input, you'll receive an error.
*/

'use strict';

var util = require('util');
var flipr = require('../lib/flipr');

flipr.init({
  source: require('./config/feature-flipping-source'),
  //inputValidator should always have 2 parameters (input and callback)
  //and it should always return either true or false to the callback.
  //error is also acceptable, but passing an error will make the
  //connect middleware return the error to the 'next' cb, ending the request.
  //In this example, we consider any request that doesn't have a userId propulated
  //to be invalid.  This means that any request coming in without a userId will
  //use the static configuration.
  inputValidator: function(input, cb) {
    if(input.hasOwnProperty('userId'))
      return void cb(null, true);
    else
      return void cb(null, false);
  },
  rules: [
    {
      type: 'equal',
      input: function(input){
        return input.user.userId === '2tm';
      },
      property: 'isUserSpecial'
    }
  ]
});

var validInput = {
  userId: '30048'
};
var invalidInput = {
  notUserId: '2tm'
};

flipr.validateInput(validInput, function(err, isValid){
  console.log(util.format('validateInput returns %s for validInput', isValid));
});

flipr.validateInput(invalidInput, function(err, isValid){
  console.log(util.format('validateInput returns %s for invalidInput', isValid));
});