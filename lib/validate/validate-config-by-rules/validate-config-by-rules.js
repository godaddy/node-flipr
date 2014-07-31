'use strict';

var async = require('async');
var _ = require('lodash');
var getItemAndValidate = require('./get-item-and-validate');
var getItemAndValidateValues = require('./get-item-and-validate-values');
var getItemAndValidateValuesByRules = require('./get-item-and-validate-values-by-rules');

module.exports = validateConfigByRules;

//TODO: Figure out a better algorithm for this, it's clunky.
function validateConfigByRules(rules, config, cb) {
  async.map(Object.keys(config), function(key, mapCb){
    async.parallel([
      _.partial(getItemAndValidate, key, config),
      _.partial(getItemAndValidateValues, key, config),
      _.partial(getItemAndValidateValuesByRules, key, rules, config)
    ], mapCb);
  }, cb);
}




