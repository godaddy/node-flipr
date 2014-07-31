'use strict';

var _ = require('lodash');
var util = require('util');
var validateValueByRule = require('./validate-value-by-rule');

module.exports = validateValuesByRule;

function validateValuesByRule(key, values, rule, cb) {
  //We can't validate if values is not an array
  //A previous validator will have reported this error.
  if(!_.isArray(values)
    || values.length === 0)
    return void cb();

  var property = rule.property;
  if(rule.type === 'percent')
    property = property || 'percent';

  var errors = [];

  var reducedValues = _.reduce(values,
    _.partialRight(validateValueByRule, key, property, rule),
    {errors: [], percentTotal: 0});

  errors = errors.concat(reducedValues.errors);
  if(reducedValues.percentTotal !== 0
    && reducedValues.percentTotal !== 100)
    errors.push(new Error(util.format('percent properties "%s" in values do not add up to 100 for key "%s"', property, key)));

  if(errors.length > 0)
    cb(null, errors);
  else
    cb();
}