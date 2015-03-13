'use strict';

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sutPath = '../../lib/validate/validate-rule-sync';

describe('validate-rule-sync', function(){
  it('throws an error if rule is invalid', function(){
    var sutProxy = proxyquire(sutPath, {
      '../validate/validate-rule': validateRuleMock(new Error())
    });
    expect(function(){
      sutProxy('someinvalidrule');
    }).to.throw(Error);
  });

  it('passes for a valid rule', function(){
    var sutProxy = proxyquire(sutPath, {
      '../validate/validate-rule': validateRuleMock()
    });
    expect(function(){
      sutProxy('somerule');
    }).to.not.throw(Error);
  });
});

function validateRuleMock(error) {
  return function(rule, cb){
    cb(null, [error]);
  };
}