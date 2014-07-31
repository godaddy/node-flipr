'use strict';

var _ = require('lodash');

module.exports = getValueFromItem;

var VALUE_FOUND = true;

function getValueFromItem(item, cb) {
  if(!_.isObject(item))
    return void cb(new Error('getValueFromItem: item must be an object'));
  //we want to pass along item if no value found
  if(_.isUndefined(item.value))
    return void cb(null, item);
  //returns true to indicate that the item is found
  //ends waterfall early
  cb(VALUE_FOUND, item.value);
}