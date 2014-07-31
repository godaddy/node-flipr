'use strict';

var _ = require('lodash');

module.exports = function(func) {
  return function() {
    var args = Array.prototype.slice.apply(arguments);
    var cb = args.pop();
    if(!_.isFunction(cb)) {
      if(!_.isFunction(func))
        return func;
      return func.apply(this, arguments);
    }
    if(!_.isFunction(func))
      return void cb(null, func);
    cb(null, func.apply(this, args));
  };
};