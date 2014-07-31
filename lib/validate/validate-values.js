'use strict';

var util = require('util');
var _ = require('lodash');

module.exports = validateValues;

function validateValues(key, values, cb){
  var errors = [];
  if(!_.isArray(values)) {
    errors.push(new Error(util.format('values must be an array for key "%s".', key)));
    return void cb(null, errors);
  }
  errors = _.reduce(values, function(errorAccumulator, value){
    if(!_.isObject(value))
      errorAccumulator.push(new Error(util.format('items inside values must be objects for key "%s"', key)));
    else if(!value.hasOwnProperty('value'))
      errorAccumulator.push(new Error(util.format('items inside values must have a value property for key "%s"', key)));
    else if(_.isUndefined(value.value))
      errorAccumulator.push(new Error(util.format('value property must be set for items inside values for key "%s"', key)));
    return errorAccumulator;
  }, errors);
  if(errors.length > 0)
    return void cb(null, errors);
  cb();
}