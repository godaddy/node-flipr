'use strict';

var _ = require('lodash');

module.exports = getValuesFromItem;

function getValuesFromItem(item, cb) {
  if(!_.isObject(item))
    return void cb(new Error('getValuesFromItem: item must be an object'));
  if(!_.isArray(item.values))
    return void cb(new Error('getValuesFromItem: item.values must be an array'));
  cb(null, item.values);
}