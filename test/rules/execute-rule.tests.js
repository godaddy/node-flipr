'use strict';

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var sutPath = '../../lib/rules/execute-rule';
chai.use(sinonChai);

var getInputFromRuleMock;
var extractedInputMock;
var executeRuleListMock;
var executeRuleEqualMock;
var executeRulePercentMock;
var sutProxy;

describe('execute-rule', function(){
  beforeEach(function(){
    getInputFromRuleMock = sinon.spy(function(){
      return extractedInputMock;
    });
    extractedInputMock = 'extractedinput';
    executeRuleListMock = sinon.spy();
    executeRuleEqualMock = sinon.spy();
    executeRulePercentMock = sinon.spy();
    sutProxy = proxyquire(sutPath, {
      './get-input-from-rule': getInputFromRuleMock,
      './execute-rule-list': executeRuleListMock,
      './execute-rule-equal': executeRuleEqualMock,
      './execute-rule-percent': executeRulePercentMock
    });
  });
  it('calls executeRuleList if rule type is "list"', function(){
    var rule = { type: 'list' };
    sutProxy('someinput', rule, 'somevalues', 'somecb');
    expect(executeRuleListMock).to.have.been.calledWith('extractedinput', rule, 'somevalues', 'somecb');
  });
  it('calls executeRuleEqual if rule type is "equal"', function(){
    var rule = { type: 'equal' };
    sutProxy('someinput', rule, 'somevalues', 'somecb');
    expect(executeRuleEqualMock).to.have.been.calledWith('extractedinput', rule, 'somevalues', 'somecb');
  });
  it('calls executeRulePercent if rule type is "percent"', function(){
    var rule = { type: 'percent' };
    sutProxy('someinput', rule, 'somevalues', 'somecb');
    expect(executeRulePercentMock).to.have.been.calledWith('extractedinput', rule, 'somevalues', 'somecb');
  });
  it('passes no args to callback if extractedInput is undefined', function(){
    extractedInputMock = void(0);
    var rule = { type: 'equal' };
    sutProxy('someinput', rule, 'somevalues', function(){
      expect(arguments.length).to.equal(0);
    });
  });
  it('passes no args to callback if extractedInput is not string', function(){
    extractedInputMock = {};
    var rule = { type: 'equal' };
    sutProxy('someinput', rule, 'somevalues', function(){
      expect(arguments.length).to.equal(0);
    });
  });
  it('passes error to callback if rule type is not recognized', function(){
    var rule = { type: 'blah' };
    sutProxy('someinput', rule, 'somevalues', function(err){
      expect(err).to.be.instanceof(Error);
    });
  });
});