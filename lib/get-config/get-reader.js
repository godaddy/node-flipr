'use strict';

var YamlReader = require('../yaml-reader');

module.exports = getReader;

function getReader(options, cb) {
  if(getReader.cachedReader)
    return void cb(null, getReader.cachedReader);
  getReader.cachedReader = new YamlReader(options);
  cb(null, getReader.cachedReader);
}

getReader.flush = function flush(){
  getReader.cachedReader = null;
};

getReader.ignoreCache = function ignoreCache(options, cb) {
  cb(null, new YamlReader(options));
};