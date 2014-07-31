'use strict';

var util = require('util');
var _ = require('lodash');

module.exports = validateConfigItem;

function validateConfigItem(key, item, cb){
  var errors = [];
  if(!_.isObject(item)) {
    errors.push(new Error(util.format('config item must be object for key "%s".', key)));
    return void cb(null, errors);
  }
  if(item.hasOwnProperty('value')
    && item.hasOwnProperty('values'))
    errors.push(new Error(util.format('config items cannot have both value and values for key "%s"', key)));
  if(item.hasOwnProperty('value')
    && _.isUndefined(item.value))
    errors.push(new Error(util.format('config item value must be defined for key "%s"', key)));
  if(errors.length > 0)
    return void cb(null, errors);
  cb();
}