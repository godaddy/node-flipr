'use strict';

var _ = require('lodash');

module.exports = validateOptions;

function validateOptions(options) {
  if(!_.isObject(options))
    throw new Error('validateOptions: options must be an object');
  if(!_.isObject(options.source))
    throw new Error('validateOptions: options.source must be an object');
}