'use strict';

var crypto = require('crypto');

module.exports = function(id) {
  return crypto
    .createHash('md5')
    .update(String(id), 'utf-8')
    .digest()
    .readUInt32LE(4) / 4294967295;
};