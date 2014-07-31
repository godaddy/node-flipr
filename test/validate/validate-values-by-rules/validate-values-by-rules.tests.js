'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../../lib/validate/validate-values-by-rules/validate-values-by-rules';

chai.use(sinonChai);

var asyncMock = mockAsync();
var lodashMock = mockLodash();
var sutProxy = proxyquire(sutPath, {
	'async': asyncMock,
  'lodash': lodashMock,
	'./validate-values-by-rule': 'validateValuesByRule'
});

describe('validate-values-by-rules', function(){
	it('maps rules to validateValuesByRule', function(){
		sutProxy('somekey', 'somerules', 'somevalues', 'somecb');
		expect(asyncMock.map).to.be.calledWith('somerules', 'validateValuesByRule', 'somecb');
		expect(lodashMock.partial).to.be.calledWith('validateValuesByRule', 'somekey', 'somevalues');
	});
});

function mockAsync(){
  return {
    map: sinon.spy()
  };
}

function mockLodash(){
  return {
    partial: sinon.spy(function(func){ return func; }),
  };
}