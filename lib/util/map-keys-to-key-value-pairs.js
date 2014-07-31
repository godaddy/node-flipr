'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = mapKeysToKeyValuePairs;

//This is a little confusing, but basically, we are accepting
//an array of keys, mapping them to a waterfall which calls
//valueFunc with keys + otherArgs, creates a key/value pair,
// and spits out [[key, value], [key,value]...].
//The last two parameters of valueFunc should be key and cb
//(e.g. valueFunc(someArg, key, cb)).
function mapKeysToKeyValuePairs(valueFunc, otherArgs, keys, cb) {
  //makes otherArgs optional
  if(_.isFunction(keys)) {
    cb = keys;
    keys = otherArgs;
    otherArgs = [];
  }
  if(!_.isFunction(valueFunc))
    return void cb(new Error('mapKeysToKeyValuePairs: valueFunc must be a function.'));
  if(!_.isArray(otherArgs))
    return void cb(new Error('mapKeysToKeyValuePairs: otherArgs must be an array if it is provided.'));
  if(!_.isArray(keys))
    return void cb(new Error('mapKeysToKeyValuePairs: keys must be an array.'));
  if(!_.isFunction(cb))
    return void cb(new Error('mapKeysToKeyValuePairs: cb must be a function.'));

  async.map(keys, function(key, mapCb){
    var modifiedArgs = _.clone(otherArgs);
    modifiedArgs.unshift(valueFunc);
    modifiedArgs.push(key);
    async.waterfall([
      _.partial.apply(_, modifiedArgs),
      _.partial(createKeyValuePair, key)
    ], mapCb);
  }, cb);
}

function createKeyValuePair(key, value, cb) {
  cb(null, [key, value]);
}