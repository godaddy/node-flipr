'use strict';

var EARLY_END = true;

module.exports = function(cb) {
  return function(endReason, result) {
    //EARLY_END means one of the steps in the waterfall
    //explicitely passed true to skip the rest of the waterfall
    //and return a result.
    if(endReason === EARLY_END)
      return void cb(null, result);
    //Any other endReason is treated as an error
    if(endReason)
      return void cb(endReason);
    cb(null, result);
  };
};