'use strict';

var _ = require('lodash');
var getInputFromRule = require('./get-input-from-rule');
var executeRuleList = require('./execute-rule-list');
var executeRuleEqual = require('./execute-rule-equal');
var executeRulePercent = require('./execute-rule-percent');

module.exports = executeRule;

//We assume parameters are validated before they reach this point.
function executeRule(input, rule, values, cb) {
  var extractedInput = getInputFromRule(input, rule);
  if(!_.isString(extractedInput))
    //We can't execute rule if input was not found,
    //or it is not a string.
    //The inputValidator should be used to catch
    //situations when the input passed in is invalid.
    //If the input passes validation, we assume that a
    //missing input should skip rule execution and either
    //return the default value for that key, or undefined
    //if no default value is set.
    return void cb();
  switch(rule.type) {
    case 'list':
      executeRuleList(extractedInput, rule, values, cb);
      break;
    case 'equal':
      executeRuleEqual(extractedInput, rule, values, cb);
      break;
    case 'percent':
      executeRulePercent(extractedInput, rule, values, cb);
      break;
    default:
      cb(new Error('executeRule: rule.type not recognized: ' + rule.type));
  }
}