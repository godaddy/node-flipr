'use strict';

var _ = require('lodash');
var async = require('async');
var passReqToFliprIfValid = require('./pass-req-to-flipr-if-valid');

module.exports = function(req, res, next) {
  async.waterfall([
    //Avoid circular dependency issue by using require here.
    _.partial(require('../flipr').validateInput, req),
    _.partial(passReqToFliprIfValid, req)
  ], function(err, config){
    if(err)
      return void next(err);
    req.config = config;
    next();
  });
};

