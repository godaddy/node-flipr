'use strict';

var async = require('async');
var _ = require('lodash');
var executeRule = require('../rules/execute-rule');
var executeRuleDefault = require('../rules/execute-rule-default');

module.exports = filterValuesByRules;

function filterValuesByRules(input, rules, values, cb) {
  if(!_.isFunction(cb))
    throw new Error('filterValuesByRules: cb must be a function');
  if(!_.isObject(input))
    return void cb(new Error('filterValuesByRules: input must be an object'));
  if(!_.isArray(rules))
    return void cb(new Error('filterValuesByRules: rules must be an array'));
  if(!_.isArray(values))
    return void cb(new Error('filterValuesByRules: values must be an array'));
  if(values.length === 0)
    return void cb(null, values);
  var rulesToFilterBy = rules.map(function(rule){
    return _.partial(executeRule, input, rule, values);
  });
  //The default rule is always processed last.
  rulesToFilterBy.push(_.partial(executeRuleDefault, values));
  async.waterfall(rulesToFilterBy, cb);
}