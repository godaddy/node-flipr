'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-config/validate-config';

chai.use(sinonChai);

var sutProxy;
var asyncMock;
var lodashMock;
var validateRuleMock;
var getConfigAndValidateMock;
var aggregateValidationErrorsMock;


describe('validate-config', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    validateRuleMock = 'validateRule';
    getConfigAndValidateMock = 'getConfigAndValidate';
    aggregateValidationErrorsMock = 'aggregateValidationErrors';
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      '../validate-rule': validateRuleMock,
      './get-config-and-validate': getConfigAndValidateMock,
      './aggregate-validation-errors': aggregateValidationErrorsMock
    });
  });

  it('sends an error to callback if the rules object is not an array', function(){
    var options = {rules: 'notArray'};
    sutProxy(options, function(err, errors){
      expect(err).to.be.null;
      expect(errors.length).to.equal(1);
    });
  });

  it('calls the correct steps in series', function(){
    var options = {rules: ['somerule']};
    sutProxy(options, 'somecb');
    expect(asyncMock.series).to.have.been.calledWithMatch([
      'map',
      'getConfigAndValidate'
    ], 'aggregateValidationErrors');
    expect(lodashMock.partial).to.have.been.calledWith('map', options.rules, 'validateRule');
    expect(lodashMock.partial).to.have.been.calledWith('getConfigAndValidate', options);
    expect(lodashMock.partialRight).to.have.been.calledWith('aggregateValidationErrors', 'somecb');
  });
});

function mockAsync(){
  return {
    series: sinon.spy(),
    map: 'map'
  };
}

function mockLodash(){
  return {
    partial: sinon.spy(function(func){ return func; }),
    partialRight: sinon.spy(function(func){ return func; })
  };
}