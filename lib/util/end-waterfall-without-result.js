'use strict';

var EARLY_END = true;

module.exports = endWaterfallWithoutResult;

function endWaterfallWithoutResult(cb) {
  return function(endReason, result) {
    //EARLY_END means one of the steps in the waterfall
    //explicitely passed true to skip the rest of the waterfall.
    //In this case, we don't want to return a result.
    if(endReason === EARLY_END)
      return void cb();
    //Any other endReason is treated as an error
    if(endReason)
      return void cb(endReason);
    //If the waterfall didn't end early, we want to return the result.
    cb(null, result);
  };
}