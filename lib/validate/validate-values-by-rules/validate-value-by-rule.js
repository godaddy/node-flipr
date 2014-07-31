'use strict';

var _ = require('lodash');
var util = require('util');

module.exports = validateValueByRule;

//This is used in a reduce operation.  Accumulator should have two properties,
//errors (array) and percentTotal (number)
function validateValueByRule(accumulator, value, index, collection, key, property, rule){
  //If value is not an object, we can't validate it by the rule.
  //A previous validator will have reported this error.
  if(!_.isObject(value))
    return accumulator;

  if(!value.hasOwnProperty(property))
    return accumulator; //property does not exist on value, this is valid

  var propertyValue = value[property];
  if(_.isUndefined(propertyValue)) {
    accumulator.errors.push(new Error(util.format('property "%s" is undefined for key "%s"', property, key)));
    return accumulator;
  }

  switch(rule.type) {
    case 'equal':
      if(!_.isString(propertyValue)
        && !_.isNumber(propertyValue)
        && !_.isBoolean(propertyValue))
        accumulator.errors.push(new Error(util.format('equal property "%s" must be a string, number, or boolean for key "%s"', property, key)));
      break;
    case 'list':
      if(!_.isArray(propertyValue)) {
        accumulator.errors.push(new Error(util.format('list property "%s" must be an array for key "%s"', property, key)));
        return accumulator;
      }
      _.each(propertyValue, function(listValue){
        if(!_.isString(listValue)
          && !_.isNumber(listValue)
          && !_.isBoolean(listValue))
          accumulator.errors.push(new Error(util.format('values in list property "%s" must be a string, number, or boolean for key "%s"', property, key)));
      });
      break;
    case 'percent':
      if(!_.isNumber(propertyValue)
        || propertyValue > 100
        || propertyValue < 0)
        accumulator.errors.push(new Error(util.format('percent property "%s" must be a number between 0 and 100 inclusive for key "%s"', property, key)));
      else
        accumulator.percentTotal += propertyValue;
      break;
  }

  return accumulator;
}