'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../lib/middleware/connect-req-config';
chai.use(sinonChai);

var asyncMock;
var lodashMock;
var fliprMock;
var passReqToFliprIfValidMock;
var sutProxy;


describe('connect-req-config', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    fliprMock = mockFlipr();
    passReqToFliprIfValidMock = 'passReqToFliprIfValid';
    lodashMock = mockLodash();
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      '../flipr': fliprMock,
      './pass-req-to-flipr-if-valid': passReqToFliprIfValidMock
    });
  });
  it('calls async.waterfall with the correct functions', function(){
    var req = {};
    sutProxy(req, {}, function(){});
    expect(asyncMock.waterfall).to.have.been.calledWith([
      'validateInput',
      'passReqToFliprIfValid'
    ], sinon.match.func);
    expect(lodashMock.partial).to.have.been.calledWith('validateInput', req);
    expect(lodashMock.partial).to.have.been.calledWith('passReqToFliprIfValid', req);
  });
  it('it sets req.config if waterfall returns config and calls next', function(){
    var next = sinon.spy();
    var req = {};
    sutProxy(req, {}, next);
    var waterfallCb = asyncMock.waterfall.args[0][1];
    waterfallCb(null, 'someconfig');
    expect(req.config).to.equal('someconfig');
    expect(next).to.have.been.called;
  });
  it('passes errors to next', function(){
    sutProxy('req', 'res', function(err){
      expect(err).to.be.instanceOf(Error);
    });
    var waterfallCb = asyncMock.waterfall.args[0][1];
    waterfallCb(new Error());
  });
});

function mockAsync(){
  return {
    waterfall: sinon.spy()
  };
}

function mockLodash(){
  return {
    partial: sinon.spy(function(func){ return func; })
  };
}

function mockFlipr(){
  return {
    validateInput: 'validateInput'
  };
}