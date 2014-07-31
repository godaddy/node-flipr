'use strict';

var async = require('async');
var _ = require('lodash');
var getConfig = require('../../get-config/get-config');
var validateConfigByRules = require('../validate-config-by-rules/validate-config-by-rules');

module.exports = getConfigAndValidate;

function getConfigAndValidate(options, cb){
  async.waterfall([
    _.partial(getConfig.ignoreCache, options),
    _.partial(validateConfigByRules, options.rules)
  ], cb);
}