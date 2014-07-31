'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = asyncMemoizeWithFlush;

function asyncMemoizeWithFlush(func, memoHasher){
  if(!_.isFunction(func))
    throw new Error('asyncMemoizeWithFlush: func must be a function');
  memoHasher = setupMemoHasher(memoHasher);
  var memoizedFunc = async.memoize(func, memoHasher);
  var newFunc = function() {
    var args = Array.prototype.slice.apply(arguments);
    memoizedFunc.apply(this, args);
  };
  newFunc.flush = function(){
    memoizedFunc = async.memoize(func, memoHasher);
  };
  return newFunc;
}

function setupMemoHasher(memoHasher){
  if(_.isUndefined(memoHasher))
    return memoHasher;
  if(_.isFunction(memoHasher))
    return memoHasher;
  if(_.isString(memoHasher))
    return function() { return memoHasher; };

  throw new Error('setupMemoHasher: memoHasher must be undefined, function, or string');
}