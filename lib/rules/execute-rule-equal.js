'use strict';

var _ = require('lodash');

module.exports = executeRuleEqual;

var MATCH_FOUND = true;

function executeRuleEqual(input, rule, values, cb) {
  var firstMatch = _.find(values, function(value){
    var property = value[rule.property];
    if(_.isUndefined(property))
      return false;
    property = String(property);
    return rule.isCaseSensitive ? property === input : property.toLowerCase() === input;
  });
  if(firstMatch)
    cb(MATCH_FOUND, firstMatch.value);
  else
    cb();
}