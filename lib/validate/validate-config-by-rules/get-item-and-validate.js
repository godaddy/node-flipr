'use strict';

var async = require('async');
var _ = require('lodash');
var getItemFromConfig = require('../../config-reader/get-item-from-config');
var validateConfigItem = require('../validate-config-item');

module.exports = getItemAndValidate;

function getItemAndValidate(key, config, cb) {
  async.waterfall([
    _.partial(getItemFromConfig, key, config),
    _.partial(validateConfigItem, key),
  ], cb);
}