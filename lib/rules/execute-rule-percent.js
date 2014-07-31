'use strict';

var _ = require('lodash');
var idToPercent = require('../util/id-to-percent');

module.exports = executeRulePercent;

var MATCH_FOUND = true;

function executeRulePercent(input, rule, values, cb) {
  var inputPercent = idToPercent(input);
  var sortedValues = sortValuesByPercentAscending(values);
  var match = _.reduce(sortedValues, function(match, value) {
    var property = value[rule.property] || 'percent';
    if(match.found)
      return match;
    var percent = (value[property] || 0) / 100;
    match.accumulatedPercent += percent;
    if(inputPercent <= match.accumulatedPercent)
      match.found = value;
    return match;
  }, {
    accumulatedPercent: 0.0,
    found: null
  });

  if(match.found)
    cb(MATCH_FOUND, match.found.value);
  else
    cb();
}

function sortValuesByPercentAscending(values) {
  return values.sort(function(a, b){
    var aPercent = a.percent || 0;
    var bPercent = b.percent || 0;
    return aPercent < bPercent
      ? -1
      : aPercent === bPercent
        ? 0
        : 1;
  });
}