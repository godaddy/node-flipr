'use strict';

var async = require('async');
var _ = require('lodash');
var getItemFromConfig = require('../../config-reader/get-item-from-config');
var getValuesFromItemSafe = require('../../config-reader/get-values-from-item-safe');
var validateValuesByRules = require('../validate-values-by-rules/validate-values-by-rules');
var endWaterfallWithoutResult= require('../../util/end-waterfall-without-result');

module.exports = getItemAndValidateValuesByRules;

function getItemAndValidateValuesByRules(key, rules, config, cb) {
  async.waterfall([
    _.partial(getItemFromConfig, key, config),
    _.partial(getValuesFromItemSafe), //possible early end
    _.partial(validateValuesByRules, key, rules)
  ], endWaterfallWithoutResult(cb));
}