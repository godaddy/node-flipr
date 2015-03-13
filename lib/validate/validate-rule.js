'use strict';

var _ = require('lodash');

module.exports = validateRule;

function validateRule(rule, cb) {
  var errors = [];
  if(!rule.hasOwnProperty('type'))
    errors.push(new Error('rule must have a type property'));
  else if(rule.type !== 'equal' && rule.type !== 'list' && rule.type !== 'percent')
    errors.push(new Error('rule.type must be one of the following: equal, list, percent'));
  if(!rule.hasOwnProperty('input'))
    errors.push(new Error('rule must have an input property'));
  else if(!_.isFunction(rule.input) && !_.isString(rule.input))
    errors.push(new Error('rule.input must be a function or a string'));
  if(rule.type !== 'percent' && !rule.hasOwnProperty('property'))
    errors.push(new Error('rule.property must exist for all types except "percent"'));
  if(errors.length > 0)
    return void cb(null, errors);
  cb();
}