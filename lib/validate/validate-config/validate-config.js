'use strict';

var async = require('async');
var _ = require('lodash');
var validateRule = require('../validate-rule');
var getConfigAndValidate = require('./get-config-and-validate');
var aggregateValidationErrors = require('./aggregate-validation-errors');

module.exports = validateConfig;

function validateConfig(options, cb) {
  var errors = [];
  
  if(!_.isArray(options.rules)) {
    errors.push(new Error('options.rules must be an array'));
    return void cb(null, errors);
  }

  async.series([
    _.partial(async.map, options.rules, validateRule),
    _.partial(getConfigAndValidate, options)
  ], _.partialRight(aggregateValidationErrors, cb));
}
