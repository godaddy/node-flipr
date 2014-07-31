'use strict';

var _ = require('lodash');

module.exports = executeRuleList;

var MATCH_FOUND = true;

function executeRuleList(input, rule, values, cb) {
  var firstMatch = _.find(values, function(value){
    var propertyValues = value[rule.property];
    if(!_.isArray(propertyValues))
      return false;
    var found = _.find(propertyValues, function(propertyValue){
      propertyValue = String(propertyValue);
      return rule.isCaseSensitive
        ? propertyValue === input
        : propertyValue.toLowerCase() === input;
    });
    return !!found;
  });
  if(firstMatch)
    cb(MATCH_FOUND, firstMatch.value);
  else
    cb();
}