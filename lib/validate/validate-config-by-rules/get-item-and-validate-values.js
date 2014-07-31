'use strict';

var async = require('async');
var _ = require('lodash');
var getItemFromConfig = require('../../config-reader/get-item-from-config');
var validateValues = require('../validate-values');
var getValuesFromItemSafe = require('../../config-reader/get-values-from-item-safe');
var endWaterfallWithoutResult= require('../../util/end-waterfall-without-result');

module.exports = getItemAndValidateValues;

function getItemAndValidateValues(key, config, cb) {
  async.waterfall([
    _.partial(getItemFromConfig, key, config),
    _.partial(getValuesFromItemSafe), //possible early end
    _.partial(validateValues, key)
  ], endWaterfallWithoutResult(cb));
}