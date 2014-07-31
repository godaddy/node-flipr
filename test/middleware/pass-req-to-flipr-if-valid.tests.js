'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../lib/middleware/pass-req-to-flipr-if-valid';
chai.use(sinonChai);

var sutProxy;
var fliprMock;

describe('pass-req-to-flipr-if-valid', function(){
  beforeEach(function(){
    fliprMock = sinon.spy();
    sutProxy = proxyquire(sutPath, {
      '../flipr': fliprMock
    });
  });

  it('passes req and cb to flipr if isValid is true', function(){
    sutProxy('somereq', true, 'somecb');
    expect(fliprMock).to.have.been.calledWith('somereq', 'somecb');
  });
  it('passes cb but not req to flipr if isValid is false', function(){
    sutProxy('somereq', false, 'somecb');
    expect(fliprMock).to.have.been.calledWith('somecb');
  });
});