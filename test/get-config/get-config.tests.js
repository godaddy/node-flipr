'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../lib/get-config/get-config';
chai.use(sinonChai);

var asyncMock;
var lodashMock;
var getReaderMock;
var readConfigMock;
var sutProxy;

describe('get-config', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    getReaderMock = mockGetReader();
    readConfigMock = mockReadConfig();
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      './get-reader': getReaderMock,
      './read-config': readConfigMock
    });
  });
  describe('exported function', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy('options', 'somefunc');
      expect(asyncMock.waterfall).to.be.calledWithMatch([
        getReaderMock,
        readConfigMock
      ],'somefunc');
      expect(lodashMock.partial).to.be.calledWith(getReaderMock, 'options');
    });
  });
  describe('#flush', function(){
    it('calls flush on getReader and readConfig', function(){
      sutProxy.flush();
      expect(getReaderMock.flush).to.be.called;
      expect(readConfigMock.flush).to.be.called;
    });
  });
  describe('#ignoreCache', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.ignoreCache('someoptions', 'somecb');
      expect(asyncMock.waterfall).to.be.calledWith([
        getReaderMock.ignoreCache,
        readConfigMock.ignoreCache
      ], 'somecb');
      expect(lodashMock.partial).to.be.calledWith(getReaderMock.ignoreCache, 'someoptions');
    });
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

function mockGetReader(){
  return {
    flush: sinon.spy(),
    ignoreCache: 'ignoreCache'
  };
}

function mockReadConfig(){
  return {
    flush: sinon.spy(),
    ignoreCache: 'ignoreCache'
  };
}