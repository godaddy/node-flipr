'use strict';

module.exports = passReqToFliprIfValid;

function passReqToFliprIfValid(req, isValid, cb) {
  //Avoid circular reference by requiring inside function
  var flipr = require('../flipr');
  if(isValid === true)
    flipr(req, cb);
  else
    flipr(cb);
}