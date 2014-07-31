'use strict';

module.exports = ignoreLastResult;

//Used in async.waterfall to avoid passing result
//of previous step to the next step
function ignoreLastResult(result, cb) {
  cb();
}