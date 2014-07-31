'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../lib/config-reader/config-reader';
chai.use(sinonChai);

var sutProxy;
var asyncMock;
var lodashMock;
var endWaterfallMock;
var getConfigMock;
var getItemFromConfigMock;
var getValueFromItemMock;
var getValuesFromItemMock;
var filterValuesByRulesMock;
var getDefaultMock;
var asyncMemoizeWithFlushMock;
var addCallbackMock;
var mapKeysToKeyValuePairsMock;

describe('config-reader', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    getConfigMock = mockGetConfig();
    getItemFromConfigMock = 'getItemFromConfig';
    getValueFromItemMock = 'getValueFromItem';
    getValuesFromItemMock = 'getValuesFromItem';
    getDefaultMock = 'getDefault';
    filterValuesByRulesMock = 'filterValuesByRules';
    endWaterfallMock = sinon.stub().returns('endWaterfall');
    addCallbackMock = function(values){return values;};
    mapKeysToKeyValuePairsMock = 'mapKeysToKeyValuePairs';
    asyncMemoizeWithFlushMock = mockAsyncMemoizeWithFlush();
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      '../util/end-waterfall': endWaterfallMock,
      '../get-config/get-config': getConfigMock,
      './get-item-from-config': getItemFromConfigMock,
      './get-value-from-item': getValueFromItemMock,
      './get-values-from-item': getValuesFromItemMock,
      '../value-extractors/match-default': getDefaultMock,
      './filter-values-by-rules': filterValuesByRulesMock,
      '../util/async-memoize-with-flush': asyncMemoizeWithFlushMock,
      '../util/add-callback': addCallbackMock,
      '../util/map-keys-to-key-value-pairs': mapKeysToKeyValuePairsMock
    });
  });
  describe('module setup', function(){
    it('memoizes getValueByKey and getDictionary', function(){
      expect(asyncMemoizeWithFlushMock).to.have.been.calledWith(sinon.match.func);
      expect(asyncMemoizeWithFlushMock).to.have.been.calledWith(sinon.match.func, 'fakekey');
      expect(sutProxy.getValueByKey.flush).to.be.a.func;
      expect(sutProxy.getDictionary.flush).to.be.a.func;
    });
  });
  //we combine init and preload into one test because preload is used
  //to test init's implementation
  describe('#init and #preload', function(){
    it('sets cached options and calls getConfig', function(){
      sutProxy.init('options');
      sutProxy.preload(function(){});
      expect(getConfigMock).to.have.been.calledWith('options', sinon.match.func);
    });
  });
  describe('#flush', function(){
    it('flushes getConfig and memoized getters', function(){
      sutProxy.flush();
      expect(getConfigMock.flush).to.have.been.called;
      expect(sutProxy.getValueByKey.flush).to.have.been.called;
      expect(sutProxy.getDictionary.flush).to.have.been.called;
    });
  });
  describe('#getValueByKey', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.init('someoptions');
      sutProxy.getValueByKey('somekey', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        getConfigMock,
        getItemFromConfigMock,
        getValueFromItemMock
      ],
      'endWaterfall');
      expect(lodashMock.partial).to.have.been.calledWith(getConfigMock, 'someoptions');
      expect(lodashMock.partial).to.have.been.calledWith(getItemFromConfigMock, 'somekey');
      expect(endWaterfallMock).to.have.been.calledWith('somecb');
    });
  });
  describe('#getValueByRulesAndKey', function(){
    it('calls async.waterfall with correct functions', function(){
      var options = {
        rules: 'somerules'
      };
      sutProxy.init(options);
      var input = 'input';
      sutProxy.getValueByRulesAndKey(input, 'somekey', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        getConfigMock,
        getItemFromConfigMock,
        getValueFromItemMock,
        getValuesFromItemMock,
        filterValuesByRulesMock
      ],
      'endWaterfall');
      expect(lodashMock.partial).to.have.been.calledWith(getConfigMock, options);
      expect(lodashMock.partial).to.have.been.calledWith(getItemFromConfigMock, 'somekey');
      expect(lodashMock.partial).to.have.been.calledWith(filterValuesByRulesMock, input, 'somerules');
      expect(endWaterfallMock).to.have.been.calledWith('somecb');
    });
  });
  describe('#getDictionary', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.init('someoptions');
      sutProxy.getDictionary('somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        getConfigMock,
        Object.keys,
        mapKeysToKeyValuePairsMock,
        '_.zipObject'
      ],
      'somecb');
      expect(lodashMock.partial).to.have.been.calledWith(getConfigMock, 'someoptions');
      expect(lodashMock.partial).to.have.been.calledWith(mapKeysToKeyValuePairsMock, sutProxy.getValueByKey);
    });
  });
  describe('#getDictionaryByRules', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.init('someoptions');
      sutProxy.getDictionaryByRules('someinput', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        getConfigMock,
        Object.keys,
        mapKeysToKeyValuePairsMock,
        '_.zipObject'
      ],
      'somecb');
      expect(lodashMock.partial).to.have.been.calledWith(getConfigMock, 'someoptions');
      expect(lodashMock.partial).to.have.been.calledWith(mapKeysToKeyValuePairsMock, sutProxy.getValueByRulesAndKey, ['someinput']);
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
    partial: sinon.spy(function(func){ return func; }),
    zipObject: '_.zipObject'
  };
}

function mockAsyncMemoizeWithFlush() {
  return sinon.spy(function(func){
    func.flush = sinon.spy();
    return func;
  });
}

function mockGetConfig(){
  function getConfig(options, cb){
    return cb(null, 'someconfig');
  }
  getConfig.flush = sinon.spy();
  return sinon.spy(getConfig);
}