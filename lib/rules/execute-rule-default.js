'use strict';

var _ = require('lodash');
var MATCH_FOUND = true;

module.exports = executeRuleDefault;

function executeRuleDefault(values, cb){
  if(!_.isArray(values) || values.length === 0)
    return void cb();
  var firstMatch = _.find(values, function(value){
    //A value is considered default when it has only
    //one property, and that property is 'value'
    var keys = Object.keys(value);
    return keys.length === 1 && keys[0] === 'value';
  });
  if(firstMatch)
    cb(MATCH_FOUND, firstMatch.value);
  else
    cb();
}