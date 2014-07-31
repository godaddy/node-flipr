'use strict';

var _ = require('lodash');
var async = require('async');
var getConfig = require('../get-config/get-config');
var endWaterfall = require('../util/end-waterfall');
var addCallback = require('../util/add-callback');
var getItemFromConfig = require('./get-item-from-config');
var getValueFromItem = require('./get-value-from-item');
var getValuesFromItem = require('./get-values-from-item');
var filterValuesByRules = require('./filter-values-by-rules');
var asyncMemoizeWithFlush = require('../util/async-memoize-with-flush');
var mapKeysToKeyValuePairs = require('../util/map-keys-to-key-value-pairs');

var memoizedGetValueByKey = asyncMemoizeWithFlush(getValueByKey);
//fakekey just gives us a single hash key for memoization, meaning
//getDictionary always returns the same value, and we want to cache it
//once and always return the cached value.
var memoizedGetDictionary = asyncMemoizeWithFlush(getDictionary, 'fakekey');

module.exports = {
  init: init,
  preload: preload,
  flush: flush,
  getValueByKey: memoizedGetValueByKey,
  getValueByRulesAndKey: getValueByRulesAndKey,
  getDictionary: memoizedGetDictionary,
  getDictionaryByRules: getDictionaryByRules
};

var cachedOptions;

function init(options) {
  cachedOptions = options;
}

function preload(cb) {
  getConfig(cachedOptions, cb);
}

function flush() {
  getConfig.flush();
  memoizedGetValueByKey.flush();
  memoizedGetDictionary.flush();
}

function getValueByKey(key, cb) {
  async.waterfall([
    _.partial(getConfig, cachedOptions),
    _.partial(getItemFromConfig, key),
    getValueFromItem
  ], endWaterfall(cb));
}

function getValueByRulesAndKey(input, key, cb) {
  async.waterfall([
    _.partial(getConfig, cachedOptions),
    _.partial(getItemFromConfig, key),
    getValueFromItem, //early end possible
    getValuesFromItem,
    _.partial(filterValuesByRules, input, cachedOptions.rules) //early end possible
  ], endWaterfall(cb));
}

function getDictionary(cb) {
  async.waterfall([
    _.partial(getConfig, cachedOptions),
    addCallback(Object.keys),
    _.partial(mapKeysToKeyValuePairs, getValueByKey),
    addCallback(_.zipObject)
  ], cb);
}

function getDictionaryByRules(input, cb) {
  async.waterfall([
    _.partial(getConfig, cachedOptions),
    addCallback(Object.keys),
    _.partial(mapKeysToKeyValuePairs, getValueByRulesAndKey, [input]),
    addCallback(_.zipObject)
  ], cb);
}

