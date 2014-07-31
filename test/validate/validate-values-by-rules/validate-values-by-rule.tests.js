'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-values-by-rules/validate-values-by-rule';

chai.use(sinonChai);

var sutProxy;
var lodashMock;
var validateValueByRuleMock;
var reduceResult;

describe('validate-values-by-rule', function(){
  beforeEach(function(){
    reduceResult = {
      errors: [],
      percentTotal: 0
    };
    lodashMock = mockLodash();
    validateValueByRuleMock = 'validateValueByRule';
    sutProxy = proxyquire(sutPath, {
      'lodash': lodashMock,
      './validate-value-by-rule': validateValueByRuleMock
    });
  });

  it('sends nothing to callback if values is not an array', function(){
    var cbSpy = sinon.spy();
    sutProxy('somekey', 'notarray', 'somerule', cbSpy);
    expect(cbSpy).to.be.calledWithExactly();
  });
  it('sends nothing to callback for empty values array', function(){
    var cbSpy = sinon.spy();
    sutProxy('somekey', [], 'somerule', cbSpy);
    expect(cbSpy).to.be.calledWithExactly();
  });
  it('uses "percent" property if rule type is percent and no property is defined', function(){
    sutProxy('somekey', ['somevalue'], {type:'percent'}, function(){
      expect(lodashMock.partialRight).to.be.calledWith('validateValueByRule', 'somekey', 'percent', sinon.match.object);
    });
  });
  it('sends error to callback if all values with percent are between 0 and 100 exclusive', function(){
    reduceResult.percentTotal = 5;
    sutProxy('somekey', ['somevalue'], 'somerule', function(err, errors){
      expect(errors.length).to.equal(1);
    });
  });
  it('sends errors to callback if validateValueByRule returns errors', function(){
    reduceResult.errors = ['someerror'];
    sutProxy('somekey', ['somevalue'], 'somerule', function(err, errors){
      expect(errors.length).to.equal(1);
    });
  });
  it('sends nothing to callback if there are no errors', function(){
    var cbSpy = sinon.spy();
    sutProxy('somekey', ['somevalue'], 'somerule', cbSpy);
    expect(cbSpy).to.be.calledWithExactly();
  });




});

function mockLodash() {
  return {
    reduce: function(){
      return reduceResult;
    },
    partialRight: sinon.spy()
  };
}