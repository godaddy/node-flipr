'use strict';

var validateRule = require('../validate/validate-rule');

module.exports = validateRuleSync;

function validateRuleSync(rule){
  validateRule(rule, function(err){
    if(err instanceof Error)
      throw err;
  });
}