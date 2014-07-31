'use strict';

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sutPath = '../../lib/validate/validate-rule-sync';

var sutProxy;
var validateRuleMock;
var validateRuleErr;

describe('validate-rule-sync', function(){
  beforeEach(function(){
    validateRuleErr = void(0);
    validateRuleMock = function(rule, cb){
      cb(validateRuleErr);
    };
    sutProxy = proxyquire(sutPath, {
      '../validate/validate-rule': validateRuleMock
    });
  });
  it('sends an error to callback if rule is invalid', function(){
    validateRuleErr = new Error();
    expect(function(){
      sutProxy('someinvalidrule');
    }).to.throw(Error);
  });

  it('passes for a valid rule', function(){
    expect(function(){
      sutProxy('somerule');
    }).to.not.throw(Error);
  });
});