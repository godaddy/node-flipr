'use strict';

module.exports = readConfig;

function readConfig(reader, cb) {
  if(readConfig.cachedConfig)
    return void cb(null, readConfig.cachedConfig);
  reader.getConfig(function(err, config){
    if(err)
      return void cb(err);
    readConfig.cachedConfig = config;
    cb(null, readConfig.cachedConfig);
  });
}

readConfig.flush = function flush(){
  readConfig.cachedConfig = null;
};

readConfig.ignoreCache = function ignoreCache(reader, cb){
  reader.getConfig(function(err, config){
    if(err)
      return void cb(err);
    cb(null, config);
  });
};