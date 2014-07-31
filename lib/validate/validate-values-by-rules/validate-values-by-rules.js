'use strict';

var async = require('async');
var _ = require('lodash');
var validateValuesByRule = require('./validate-values-by-rule');

module.exports = validateValuesByRules;

function validateValuesByRules(key, rules, values, cb) {
  async.map(rules, _.partial(validateValuesByRule, key, values), cb);
}