'use strict';

var _ = require('lodash');
var async = require('async');
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

var _options;
var _source;

function init(options) {
  _options = options;
  _source = options.source;
  if(_.isFunction(_source.on) && _source.events && _source.events.flush)
    _source.on(_source.events.flush, flushSelf);
}

function preload(cb) {
  if(_.isFunction(_source.preload))
    return void _source.preload(cb);
  cb();
}

function flush() {
  if(_.isFunction(_source.flush))
    _source.flush();
  flushSelf();
}

function flushSelf() {
  memoizedGetValueByKey.flush();
  memoizedGetDictionary.flush();
}

function getValueByKey(key, cb) {
  async.waterfall([
    _source.getConfig,
    _.partial(getItemFromConfig, key),
    getValueFromItem
  ], endWaterfall(cb));
}

function getValueByRulesAndKey(input, key, cb) {
  async.waterfall([
    _source.getConfig,
    _.partial(getItemFromConfig, key),
    getValueFromItem, //early end possible
    getValuesFromItem,
    _.partial(filterValuesByRules, input, _options.rules) //early end possible
  ], endWaterfall(cb));
}

function getDictionary(cb) {
  async.waterfall([
    _source.getConfig,
    addCallback(Object.keys),
    _.partial(mapKeysToKeyValuePairs, getValueByKey),
    addCallback(_.zipObject)
  ], cb);
}

function getDictionaryByRules(input, cb) {
  async.waterfall([
    _source.getConfig,
    addCallback(Object.keys),
    _.partial(mapKeysToKeyValuePairs, getValueByRulesAndKey, [input]),
    addCallback(_.zipObject)
  ], cb);
}

