'use strict';

var async = require('async');
var _ = require('lodash');
var configReader = require('./config-reader/config-reader');
var connectReqConfig = require('./middleware/connect-req-config');
var idToPercent = require('./util/id-to-percent');
var continueIfValid = require('./util/continue-if-valid');
var validateKey = require('./validate/validate-key');
var defaultInputValidator = require('./validate/default-input-validator');
var validateRuleSync = require('./validate/validate-rule-sync');
var validateConfig = require('./validate/validate-config/validate-config');

module.exports = flipr;

var defaultOptions = {
  inputValidator: defaultInputValidator,
  rules: []
};

function flipr(req, cb) {
  //makes req optional
  if(_.isFunction(req)) {
    cb = req;
    req = null;
  }

  if(!_.isFunction(cb))
    throw new Error('flipr: cb must be a function');

  if(req === null)
    flipr.getDictionary(cb);
  else
    flipr.getDictionaryByRules(req, cb);
}

flipr.cachedOptions = defaultOptions;

flipr.init = function init(options) {
  flipr.flush();
  options = _.extend(defaultOptions, options);
  _.map(options.rules, validateRuleSync); //This will throw if rules are invalid
  flipr.cachedOptions = options;
  configReader.init(options);
  return connectReqConfig;
};

flipr.getDictionary = function getDictionary(cb) {
  async.waterfall([
    configReader.getDictionary,
    function(dictionary, next) {
      if(!flipr.cachedDictionary)
        flipr.cachedDictionary = dictionary;
      next(null, dictionary);
    }
  ], cb);
};

flipr.getDictionaryByRules = function getDictionaryByRules(input, cb) {
  async.waterfall([
    _.partial(flipr.cachedOptions.inputValidator, input),
    continueIfValid,
    _.partial(configReader.getDictionaryByRules, input)
  ], cb);
};

flipr.getValue = function getValue(key, cb) {
  async.waterfall([
    _.partial(validateKey, key),
    _.partial(configReader.getValueByKey, key)
  ], cb);
};

flipr.getValueByRules = function getValue(input, key, cb) {
  async.waterfall([
    _.partial(flipr.cachedOptions.inputValidator, input),
    continueIfValid,
    _.partial(validateKey, key),
    _.partial(configReader.getValueByRulesAndKey, input, key)
  ], cb);
};

flipr.preload = configReader.preload;

flipr.flush = function(cb){
  flipr.cachedDictionary = void(0);
  configReader.flush(cb);
};

flipr.idToPercent = idToPercent;

flipr.validateInput = function(input, cb) {
  //this is wrapped because inputValidator can be changed
  flipr.cachedOptions.inputValidator(input, cb);
};

flipr.validateConfig = validateConfig;

//This is a hack feature, you should not use this.
//It should only be used if getDictionary
//has been called.  It will return a cached
//version of getDictionary.  If getDictionary
//hasn't been called before you call sync, then
//you'll get undefined.
flipr.static = function() {
  return flipr.cachedDictionary;
};