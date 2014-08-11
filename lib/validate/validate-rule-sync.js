'use strict';

var _ = require('lodash');
var validateRule = require('../validate/validate-rule');

module.exports = validateRuleSync;

function validateRuleSync(rule){
  validateRule(rule, function(err, errors){
    if(_.some(errors, function(err){return err instanceof Error;}))
      throw new Error('Rule failed to validate for the following reasons: ' + _.pluck(errors, 'message'));
  });
}