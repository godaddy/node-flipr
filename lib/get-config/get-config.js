'use strict';

var async = require('async');
var _ = require('lodash');
var getReader = require('./get-reader');
var readConfig = require('./read-config');

module.exports = getConfig;

function getConfig(options, cb) {
  async.waterfall([
    _.partial(getReader, options),
    readConfig
  ], cb);
}

getConfig.flush = function flush() {
  getReader.flush();
  readConfig.flush();
};

getConfig.ignoreCache = function ignoreCache(options, cb){
  async.waterfall([
    _.partial(getReader.ignoreCache, options),
    readConfig.ignoreCache
  ], cb);
};