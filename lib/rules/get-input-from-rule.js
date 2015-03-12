'use strict';

var _ = require('lodash');
var objectPath = require('object-path');

module.exports = getInputFromRule;

var DEFAULT_VALUE_UNDEFINED = void(0);

function getInputFromRule(input, rule) {
  var result;
  if(_.isFunction(rule.input)) {
    try {
      result = rule.input(input);
    } catch (e) {
      //Should we allow a bad input extraction break config generation?
      //Ideally, all errors should be handled inside input function.
    }
  }
  else
    result = objectPath.get(input, rule.input, DEFAULT_VALUE_UNDEFINED);

  if(!_.isString(result) && !_.isBoolean(result) && !_.isNumber(result))
    return;

  result = String(result);

  if(!rule.isCaseSensitive)
    result = result.toLowerCase();

  return result;
}