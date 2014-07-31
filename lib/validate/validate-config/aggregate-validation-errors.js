'use strict';

var _ = require('lodash');

module.exports = aggregateValidationErrors;

function aggregateValidationErrors(err, errors, cb){
  if(err)
    return void cb(err);
  var allErrors = _(errors)
    .flatten()
    .compact()
    .value();
  if(allErrors.length > 0)
    return void cb(null, allErrors);
  cb();
}