'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var path = require('path');
var sutPath = '../lib/yaml-reader';
chai.use(sinonChai);

var sutProxy;
var asyncMock;
var lodashMock;
var fsMock;
var endWaterfallMock;
var jsYamlMock;

describe('yaml-reader', function(){
  beforeEach(function(){
    asyncMock = mockAsync();
    lodashMock = mockLodash();
    endWaterfallMock = sinon.stub().returns('endWaterfall');
    fsMock = mockFs();
    jsYamlMock = mockJsYaml();
    var SutProxy = proxyquire(sutPath, {
      'async': asyncMock,
      'lodash': lodashMock,
      './util/end-waterfall': endWaterfallMock,
      'fs': fsMock,
      'js-yaml': jsYamlMock
    });
    sutProxy = new SutProxy();
    process.env = {
      'NODE_ENV': 'test'
    };
  });
  describe('#constructor', function(){
    it('new returns instance of YamlReader', function(){
      var Sut = require(sutPath);
      expect(new Sut()).to.be.instanceOf(Sut);
    });
    it('sets default options', function(){
      var Sut = require(sutPath);
      var sut = new Sut();
      expect(sut.options).to.deep.equal({
        folderPath: 'lib/config',
        envFileNameFormat: '%s.yaml',
        envLocalFileName: 'local.yaml',
        envFileNameMap: {
          dev: 'dev',
          development: 'development',
          test: 'test',
          staging: 'staging',
          master: 'prod',
          prod: 'prod',
          prodution: 'production'
        },
        envVariable: 'NODE_ENV'
      });
    });
    it('extends default options', function(){
      var Sut = require(sutPath);
      var sut = new Sut({
        foo: 'bar',
        envVariable: 'NOT_NODE_ENV'
      });
      expect(sut.options).to.deep.equal({
        folderPath: 'lib/config',
        envFileNameFormat: '%s.yaml',
        envLocalFileName: 'local.yaml',
        envFileNameMap: {
          dev: 'dev',
          development: 'development',
          test: 'test',
          staging: 'staging',
          master: 'prod',
          prod: 'prod',
          prodution: 'production'
        },
        envVariable: 'NOT_NODE_ENV',
        foo: 'bar'
      });
    });
  });
  describe('#getConfig', function(){
    it('calls getConfigByFileName if options.fileName is a string', function(){
      sutProxy.options.fileName = 'somefilename';
      sutProxy.getConfigByFileName = sinon.spy();
      sutProxy.getConfig('somecb');
      expect(sutProxy.getConfigByFileName).to.have.been.calledWith('somecb');
    });
    it('calls getConfigByFileNameFunc if options.fileName is a function', function(){
      sutProxy.options.fileName = function(){};
      sutProxy.getConfigByFileNameFunc = sinon.spy();
      sutProxy.getConfig('somecb');
      expect(sutProxy.getConfigByFileNameFunc).to.have.been.calledWith('somecb');
    });
    it('calls getConfigByEnv if options.fileName is not a string or function', function(){
      sutProxy.options.fileName = void(0);
      sutProxy.getConfigByEnv = sinon.spy();
      sutProxy.getConfig('somecb');
      expect(sutProxy.getConfigByEnv).to.have.been.calledWith('somecb');
    });
  });
  describe('#getConfigByFileNameFunc', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.options.fileName = 'somefunc';
      sutProxy.getConfigByFileNameFunc('somecb');
      expect(asyncMock.waterfall).to.be.calledWithMatch([
        sutProxy.options.fileName,
        sutProxy.getFileAbsolutePath,
        sutProxy.readFile,
        sutProxy.parseYamlToJsObject
      ],'somecb');
    });
  });
  describe('#getConfigByFileName', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.options.fileName = 'somefilename';
      sutProxy.getConfigByFileName('somecb');
      expect(asyncMock.waterfall).to.be.calledWithMatch([
        sutProxy.getFileAbsolutePath,
        sutProxy.readFile,
        sutProxy.parseYamlToJsObject
      ],'somecb');
      expect(lodashMock.partial).to.be.calledWith(sutProxy.getFileAbsolutePath, sutProxy.options.fileName);
    });
  });
  describe('#getConfigByEnv', function(){
    it('calls async.waterfall with correct functions', function(){
      sutProxy.options.envLocalFileName = 'somefilename';
      sutProxy.getConfigByEnv('somecb');
      expect(asyncMock.waterfall).to.be.calledWithMatch([
        sutProxy.getFileAbsolutePath,
        sutProxy.readFileSafe,
        sutProxy.parseYamlToJsObjectAndEndIfFound,
        sutProxy.getFileNameForCurrentEnvironment,
        sutProxy.getFileAbsolutePath,
        sutProxy.readFile,
        sutProxy.parseYamlToJsObject
      ],'endWaterfall');
      expect(lodashMock.partial).to.be.calledWith(sutProxy.getFileAbsolutePath, sutProxy.options.envLocalFileName);
      expect(endWaterfallMock).to.be.calledWith('somecb');
    });
  });
  describe('#getFileNameForCurrentEnvironment', function(){
    it('returns error if environmentVariable is not in environmentFileNameMap', function(){
      process.env.NODE_ENV = 'blah';
      sutProxy.getFileNameForCurrentEnvironment(function(err){
        expect(err).to.be.instanceOf(Error);
      });
    });
    it('returns error if environmentVariable is not set', function(){
      process.env.NODE_ENV = null;
      sutProxy.getFileNameForCurrentEnvironment(function(err){
        expect(err).to.be.instanceOf(Error);
      });
    });
    it('returns error if environmentVariable does not exist', function(){
      delete process.env.NODE_ENV;
      sutProxy.getFileNameForCurrentEnvironment(function(err){
        expect(err).to.be.instanceOf(Error);
      });
    });
    it('returns fileNameFormat formatted with fileName from environment map', function(){
      sutProxy.getFileNameForCurrentEnvironment(function(err, fileName){
        expect(fileName).to.equal('test.yaml');
      });
    });
  });
  describe('#getFileAbsolutePath', function(){
    it('returns absolute path based on cwd and options.folderPath', function(){
      sutProxy.getFileAbsolutePath('some.yaml', function(err, fileAbsolutePath){
        expect(fileAbsolutePath).to.equal(path.resolve('lib/config', 'some.yaml'));
      });
    });
  });
  describe('#readFile', function(){
    it('passes error to cb', function(){
      fsMock.readFile = function(filePath, options, cb){cb(new Error());};
      sutProxy.readFile('somepath', function(err){
        expect(err).to.be.instanceOf(Error);
      });
    });
    it('calls fs.readFile with correct parameters', function(){
      sutProxy.readFile('somepath', function(err, result){
        expect(result).to.equal('somedata');
        expect(fsMock.readFile).to.be.calledWith('somepath', {encoding:'utf-8'}, sinon.match.func);
      });
    });
  });
  describe('#readFileSafe', function(){
    it('does not pass error to cb', function(){
      sutProxy.readFile = function(filePath, cb){cb(new Error());};
      sutProxy.readFileSafe('somepath', function(err, result){
        expect(err).to.be.null;
        expect(result).to.be.null;
      });
    });
    it('calls readFile with correct parameters', function(){
      sutProxy.readFile = sinon.spy(function(filePath, cb) {
        cb(null, 'somedata2');
      });
      sutProxy.readFileSafe('somepath', function(err, result){
        expect(result).to.equal('somedata2');
        expect(sutProxy.readFile).to.be.calledWith('somepath', sinon.match.func);
      });
    });
  });
  describe('#parseYamlToJsObject', function(){
    it('catches errors and passes to cb', function(){
      jsYamlMock.safeLoad.throws('Error');
      sutProxy.parseYamlToJsObject('test', function(err){
        expect(err).to.be.instanceOf(Error);
      });
    });
    it('passes parsed yaml to cb', function(){
      sutProxy.parseYamlToJsObject('test', function(err, result){
        expect(result).to.equal('yamlstring');
      });
    });
  });
  describe('#parseYamlToJsObjectAndEndIfFound', function(){
    it('catches errors and passes to cb', function(){
      jsYamlMock.safeLoad.throws({});
      sutProxy.parseYamlToJsObjectAndEndIfFound('test', function(err){
        expect(err).to.be.instanceOf(Object);
      });
    });
    it('catches errors and passes to cb, with appended message', function(){
      jsYamlMock.safeLoad.throws({message:'test:'});
      sutProxy.parseYamlToJsObjectAndEndIfFound('test', function(err){
        expect(err).to.be.instanceOf(Object);
        expect(err.message).to.equal('test: -- Failure parsing local file.');
      });
    });
    it('passes nothing to callback if yamlString is not a string', function(){
      sutProxy.parseYamlToJsObjectAndEndIfFound({}, function(err, result){
        expect(err).to.be.undefined;
        expect(result).to.be.undefined;
      });
    });
    it('passes nothing to callback if yamlString is whitespace', function(){
      sutProxy.parseYamlToJsObjectAndEndIfFound(' ', function(err, result){
        expect(err).to.be.undefined;
        expect(result).to.be.undefined;
      });
    });
    it('passes parsed yaml to cb', function(){
      sutProxy.parseYamlToJsObjectAndEndIfFound('test', function(err, result){
        expect(result).to.equal('yamlstring');
      });
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

function mockFs() {
  return {
    readFile: sinon.spy(function(filePath, options, cb){
      cb(null, 'somedata');
    })
  };
}

function mockJsYaml() {
  return {
    safeLoad: sinon.stub().returns('yamlstring')
  };
}