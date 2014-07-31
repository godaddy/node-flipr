'use strict';

var _ = require('lodash');

module.exports = getItemFromConfig;

function getItemFromConfig(key, config, cb) {
  if(!_.isObject(config))
    return void cb(new Error('Config not found.'));

  var item = config[key];
  if(!_.isObject(item))
    return void cb(new Error('Config item not found.' + key));
  return cb(null, item);
}