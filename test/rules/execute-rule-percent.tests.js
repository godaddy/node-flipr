'use strict';

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var sutPath = '../../lib/rules/execute-rule-percent';
chai.use(sinonChai);

var idToPercentMock;
var percentToReturn;
var sutProxy;
var input;
var rule;
var values;

describe('execute-rule-percent', function(){
  beforeEach(function(){
    input = 'blah';
    rule = {
      type: 'percent'
    };
    values = [{
      value: 1,
      percent: 5
    }, {
      value: 4,
      percent: 30
    }, {
      value: 3
    }, {
      value: 2,
      percent: 15
    }, {
      value: 5,
      percent: 15
    }, {
      value: 6,
      percent: 35
    }, {
      value: 7
    }];
    idToPercentMock = sinon.spy(function(){
      return percentToReturn;
    });
    percentToReturn = 1;
    sutProxy = proxyquire(sutPath, {
      '../util/id-to-percent': idToPercentMock
    });
  });
  it('calls callback with true and value if input matches value based on rule', function(){
    percentToReturn = 0.30;
    sutProxy(input, rule, values, function(endReason, value){
      expect(endReason).to.be.true;
      expect(value).to.equal(5);
    });
  });
  it('calls callback with no args if match is not found based on rule', function(){
    values = [{
      value: 1
    }];
    sutProxy(input, rule, values, function(){
      expect(arguments.length).to.equal(0);
    });
  });
});