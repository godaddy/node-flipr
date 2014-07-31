'use strict';

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sutPath = '../../lib/get-config/get-reader';


var YamlReaderMock = YamlReader;
var sutProxy;


describe('get-reader', function(){
  beforeEach(function(){
    sutProxy = proxyquire(sutPath, {
      '../yaml-reader': YamlReaderMock
    });
  });
  describe('exported function', function(){
    it('returns cached reader if it exists', function(){
      sutProxy.cachedReader = 'blah';
      sutProxy(null, function(err, result){
        expect(result).to.equal('blah');
      });
    });
    it('creates a new YamlReader, caches result, and sends to callback', function(){
      sutProxy('options', function(err, reader){
        expect(reader).to.be.instanceof(YamlReader);
        expect(sutProxy.cachedReader).to.be.instanceof(YamlReader);
        expect(sutProxy.cachedReader.options).to.equal('options');
      });
    });
  });
  describe('#flush', function(){
    it('sets cachedReader to null', function(){
      sutProxy.cachedReader = 'hi';
      sutProxy.flush();
      expect(sutProxy.cachedReader).to.be.null;
    });
  });
  describe('#ignoreCache', function(){
    it('sends new YamlReader to callback', function(){
      sutProxy.ignoreCache('someoptions', function(err, reader){
        expect(reader).to.be.instanceof(YamlReader);
        expect(reader.options).to.equal('someoptions');
      });
    });
  });
});

function YamlReader(options) {
  this.options = options;
}