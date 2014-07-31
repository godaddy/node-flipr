'use strict';

var _ = require('lodash');

module.exports = validateKey;

function validateKey(key, cb) {
  if(!_.isString(key))
    return void cb(new Error('key is required'));
  cb();
}