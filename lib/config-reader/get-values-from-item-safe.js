'use strict';

var _ = require('lodash');

module.exports = getValuesFromItemSafe;

var NO_VALUES_FOUND = true;

function getValuesFromItemSafe(item, cb) {
  if(!_.isObject(item))
    return void cb(new Error('getValuesFromItemSafe: item must be an object'));
  var values = item.values;
  if(_.isUndefined(values))
    return void cb(NO_VALUES_FOUND); //ends waterfall
  cb(null, values);
}