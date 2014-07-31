'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../lib/flipr';
chai.use(sinonChai);

var sutProxy;
var asyncMock;
var configReaderMock;
var lodashMock;
var validateKeyMock;
var validateRuleSyncMock;
var defaultInputValidatorMock;
var continueIfValidMock;
var idToPercentMock;
var connectReqConfigMock;

describe('flipr', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    configReaderMock = mockConfigReader();
    validateKeyMock = 'validateKey';
    validateRuleSyncMock = 'validateRuleSync';
    defaultInputValidatorMock = 'defaultInputValidator';
    continueIfValidMock = 'continueIfValid';
    idToPercentMock = 'idToPercent';
    connectReqConfigMock = 'connectReqConfig';
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      './config-reader/config-reader': configReaderMock,
      './validate/validate-key': validateKeyMock,
      './validate/validate-rule-sync': validateRuleSyncMock,
      './validate/default-input-validator': defaultInputValidatorMock,
      './util/continue-if-valid': continueIfValidMock,
      './util/id-to-percent': idToPercentMock,
      './middleware/connect-req-config': connectReqConfigMock
    });
  });
  describe('exported function', function(){
    it('throws if cb is not a function', function(){
      expect(function(){
        sutProxy('somereq', 'notfunc');
      }).to.throw(Error);
    });
    it('calls getDictionary if no req', function(){
      sutProxy.getDictionary = sinon.spy();
      var cb = function someCallback(){};
      sutProxy(cb);
      expect(sutProxy.getDictionary).to.have.been.calledWith(cb);
    });
    it('calls getDictionaryByRules if req', function(){
      sutProxy.getDictionaryByRules = sinon.spy();
      var req = 'somereq';
      var cb = function someCallback(){};
      sutProxy(req, cb);
      expect(sutProxy.getDictionaryByRules).to.have.been.calledWith(req, cb);
    });
  });
  describe('#init', function(){
    it('correctly initializes flipr and returns middleware', function(){
      sutProxy.flush = sinon.spy();
      var options = {rules: ['somerule']};
      var extendedOptions = {
        inputValidator: defaultInputValidatorMock,
        rules: ['somerule']
      };
      var result = sutProxy.init(options);
      expect(sutProxy.flush).to.have.been.called;
      expect(lodashMock.map).to.have.been.calledWith(options.rules, validateRuleSyncMock);
      expect(sutProxy.cachedOptions).to.deep.equal(extendedOptions);
      expect(configReaderMock.init).to.have.been.calledWithMatch(extendedOptions);
      expect(result).to.equal(connectReqConfigMock);
    });
  });
  describe('#getDictionary', function(){
    it('calls async.waterfall with configReader.getDictionary, then caches result and passes it on to callback', function(){
      sutProxy.getDictionary('somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        configReaderMock.getDictionary,
        sinon.match.func
      ], 'somecb');
      var cacheAndPassOn = asyncMock.waterfall.args[0][0][1];
      cacheAndPassOn('somedictionary', function(err, dictionary){
        expect(dictionary).to.equal('somedictionary');
        expect(sutProxy.cachedDictionary).to.equal('somedictionary');
      });
    });
    it('does not cache dictionary if it is already cached', function(){
      sutProxy.cachedDictionary = 'cacheddictionary';
      sutProxy.getDictionary('somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        configReaderMock.getDictionary,
        sinon.match.func
      ], 'somecb');
      var cacheAndPassOn = asyncMock.waterfall.args[0][0][1];
      cacheAndPassOn('somedictionary', function(err, dictionary){
        expect(dictionary).to.equal('somedictionary');
        expect(sutProxy.cachedDictionary).to.equal('cacheddictionary');
      });
    });
  });
  describe('#getDictionaryByRules', function(){
    it('calls async waterfall with correct functions', function(){
      sutProxy.cachedOptions.inputValidator = 'someInputValidator';
      sutProxy.getDictionaryByRules('someinput', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        sutProxy.cachedOptions.inputValidator,
        continueIfValidMock,
        configReaderMock.getDictionaryByRules
      ], 'somecb');
      expect(lodashMock.partial).to.have.been.calledWith(sutProxy.cachedOptions.inputValidator, 'someinput');
      expect(lodashMock.partial).to.have.been.calledWith(configReaderMock.getDictionaryByRules, 'someinput');
    });
  });
  describe('#getValue', function(){
    it('calls async waterfall with correct functions', function(){
      sutProxy.getValue('somekey', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        validateKeyMock,
        configReaderMock.getValueByKey
      ], 'somecb');
      expect(lodashMock.partial).to.have.been.calledWith(validateKeyMock, 'somekey');
      expect(lodashMock.partial).to.have.been.calledWith(configReaderMock.getValueByKey, 'somekey');
    });
  });
  describe('#getValueByRules', function(){
    it('calls async waterfall with correct functions', function(){
      sutProxy.cachedOptions.inputValidator = 'someInputValidator';
      sutProxy.getValueByRules('someinput', 'somekey', 'somecb');
      expect(asyncMock.waterfall).to.have.been.calledWith([
        sutProxy.cachedOptions.inputValidator,
        continueIfValidMock,
        validateKeyMock,
        configReaderMock.getValueByRulesAndKey
      ], 'somecb');
      expect(lodashMock.partial).to.have.been.calledWith(sutProxy.cachedOptions.inputValidator, 'someinput');
      expect(lodashMock.partial).to.have.been.calledWith(validateKeyMock, 'somekey');
      expect(lodashMock.partial).to.have.been.calledWith(configReaderMock.getValueByRulesAndKey, 'someinput', 'somekey');
    });
  });
  describe('#preload', function(){
    it('is set to configReader.preload', function(){
      expect(sutProxy.preload).to.equal(configReaderMock.preload);
    });
  });
  describe('#flush', function(){
    it('sets flipr.cachedDictionary to udnefined and calls configReader.flush', function(){
      sutProxy.cachedDictionary = 'somedictionary';
      sutProxy.flush('somecb');
      expect(sutProxy.cachedDictionary).to.be.undefined;
      expect(configReaderMock.flush).to.have.been.calledWith('somecb');
    });
  });
  describe('#idToPercent', function(){
    it('is set to id-to-percent', function(){
      expect(sutProxy.idToPercent).to.equal(idToPercentMock);
    });
  });
  describe('#validateInput', function(){
    it('calls inputValidator on cached options', function(){
      sutProxy.cachedOptions.inputValidator = sinon.spy();
      sutProxy.validateInput('someinput', 'somecb');
      expect(sutProxy.cachedOptions.inputValidator).to.have.been.calledWith('someinput', 'somecb');
    });
  });
  describe('#static', function(){
    it('returns flipr.cachedDictionary', function(){
      sutProxy.cachedDictionary = 'blah';
      expect(sutProxy.static()).to.equal('blah');
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
    map: sinon.spy()
  };
}

function mockConfigReader(){
  return {
    getDictionary: sinon.spy(),
    getDictionaryByRules: sinon.spy(),
    getValueByKey: sinon.spy(),
    getValueByRulesAndKey: sinon.spy(),
    preload: 'preload',
    flush: sinon.spy(),
    init: sinon.spy()
  };
}