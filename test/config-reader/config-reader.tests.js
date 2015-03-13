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
var getItemFromConfigMock;
var getValueFromItemMock;
var getValuesFromItemMock;
var filterValuesByRulesMock;
var getDefaultMock;
var asyncMemoizeWithFlushMock;
var addCallbackMock;
var mapKeysToKeyValuePairsMock;
var optionsMock;

describe('config-reader', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    getItemFromConfigMock = 'getItemFromConfig';
    getValueFromItemMock = 'getValueFromItem';
    getValuesFromItemMock = 'getValuesFromItem';
    getDefaultMock = 'getDefault';
    filterValuesByRulesMock = 'filterValuesByRules';
    endWaterfallMock = sinon.stub().returns('endWaterfall');
    addCallbackMock = function(values){return values;};
    mapKeysToKeyValuePairsMock = 'mapKeysToKeyValuePairs';
    asyncMemoizeWithFlushMock = mockAsyncMemoizeWithFlush();
    optionsMock = mockOptions();
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      '../util/end-waterfall': endWaterfallMock,
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
      sutProxy.init(optionsMock);
      sutProxy.preload('somecb');
      expect(optionsMock.source.preload).to.have.been.calledWith('somecb');
    });
    it('subscribes to flush event if it is available', function(){
      sutProxy.init(optionsMock);
      expect(optionsMock.source.on).to.have.been.calledWith(optionsMock.source.events.flush, sinon.match.func);
    });
    it('does not subscribe to flush event if it is not available', function(){
      delete optionsMock.source.events.flush;
      sutProxy.init(optionsMock);
      expect(optionsMock.source.on).to.not.have.been.called;
    });
    it('does not subscribe to flush event if source has no events', function(){
      delete optionsMock.source.events;
      sutProxy.init(optionsMock);
      expect(optionsMock.source.on).to.not.have.been.called;
    });
    it('does not subscribe to flush event if souce is not an eventemitter', function(){
      optionsMock.source.on = 'not a func anymore';
      expect(function(){
        sutProxy.init(optionsMock);
      }).to.not.throw;
    });
  });
  describe('#preload', function(){
    it('will not preload source if source does not have a preload function', function(){
      optionsMock.source.preload = 'notfunc';
      sutProxy.init(optionsMock);
      var cbSpy = sinon.spy();
      sutProxy.preload(cbSpy);
      expect(cbSpy).to.have.been.called;
    });
  });
  describe('#flush', function(){
    it('flushes source and memoized getters', function(){
      sutProxy.init(optionsMock);
      sutProxy.flush();
      expect(optionsMock.source.flush).to.have.been.called;
      expect(sutProxy.getValueByKey.flush).to.have.been.called;
      expect(sutProxy.getDictionary.flush).to.have.been.called;
    });
    it('does not flush source if source has no flush function, but will flush memoized getters', function(){
      optionsMock.source.flush = 'notfunc';
      sutProxy.init(optionsMock);
      sutProxy.flush();
      expect(sutProxy.getValueByKey.flush).to.have.been.called;
      expect(sutProxy.getDictionary.flush).to.have.been.called;
    });
  });
  describe('#getValueByKey', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.init(optionsMock);
      sutProxy.getValueByKey('somekey', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        optionsMock.source.getConfig,
        getItemFromConfigMock,
        getValueFromItemMock
      ],
      'endWaterfall');
      expect(lodashMock.partial).to.have.been.calledWith(getItemFromConfigMock, 'somekey');
      expect(endWaterfallMock).to.have.been.calledWith('somecb');
    });
  });
  describe('#getValueByRulesAndKey', function(){
    it('calls async.waterfall with correct functions', function(){      
      optionsMock.rules = 'somerules';
      sutProxy.init(optionsMock);
      var input = 'input';
      sutProxy.getValueByRulesAndKey(input, 'somekey', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        optionsMock.source.getConfig,
        getItemFromConfigMock,
        getValueFromItemMock,
        getValuesFromItemMock,
        filterValuesByRulesMock
      ],
      'endWaterfall');
      expect(lodashMock.partial).to.have.been.calledWith(getItemFromConfigMock, 'somekey');
      expect(lodashMock.partial).to.have.been.calledWith(filterValuesByRulesMock, input, 'somerules');
      expect(endWaterfallMock).to.have.been.calledWith('somecb');
    });
  });
  describe('#getDictionary', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.init(optionsMock);
      sutProxy.getDictionary('somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        optionsMock.source.getConfig,
        Object.keys,
        mapKeysToKeyValuePairsMock,
        '_.zipObject'
      ],
      'somecb');
      expect(lodashMock.partial).to.have.been.calledWith(mapKeysToKeyValuePairsMock, sutProxy.getValueByKey);
    });
  });
  describe('#getDictionaryByRules', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.init(optionsMock);
      sutProxy.getDictionaryByRules('someinput', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        optionsMock.source.getConfig,
        Object.keys,
        mapKeysToKeyValuePairsMock,
        '_.zipObject'
      ],
      'somecb');
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

function mockOptions() {
  return {
    source: {
      flush: sinon.spy(),
      preload: sinon.spy(),
      getConfig: 'getConfig',
      events: {
        beforeChange: 'before-change',
        flush: 'flush',
        afterChange: 'after-change',
        error: 'error'
      },
      on: sinon.spy()
    }
  };
}