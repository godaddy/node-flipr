'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/get-config/read-config';
var sut = require(sutPath);

var readerSuccessMock = {
  getConfig: function(cb) {
    cb(null, 'config');
  }
};

var readerErrorMock = {
  getConfig: function(cb) {
    cb(new Error());
  }
};

describe('read-config', function(){
  beforeEach(function(){
    sut.cachedConfig = null;
  });
  describe('exported function', function(){
    it('returns cached config if it exists', function(){
      sut.cachedConfig = 'blah';
      sut(null, function(err, result){
        expect(result).to.equal('blah');
      });
    });
    it('calls getConfig on reader and passes any errors to callback', function(){
      sut(readerErrorMock, function(err){
        expect(err).to.be.instanceof(Error);
      });
    });
    it('calls getConfig on reader, caches result, and sends to callback', function(){
      sut(readerSuccessMock, function(err, config){
        expect(config).to.equal('config');
        expect(sut.cachedConfig).to.equal('config');
      });
    });
  });
  describe('#flush', function(){
    it('sets cachedConfig to null', function(){
      sut.cachedConfig = 'hi';
      sut.flush();
      expect(sut.cachedConfig).to.be.null;
    });
  });
  describe('#ignoreCache', function(){
    it('calls reader.getConfig and passes any errors to callback', function(){
      sut.ignoreCache(readerErrorMock, function(err){
        expect(err).to.be.instanceof(Error);
      });
    });
    it('calls reader.getConfig and passes config to callback', function(){
      sut.ignoreCache(readerSuccessMock, function(err, config){
        expect(config).to.equal('config');
      });
    });
  });
});