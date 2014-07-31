'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/map-keys-to-key-value-pairs';
var sut = require(sutPath);

var valueFuncMock = function(key, cb) {
  cb(null, key + '!');
};

var valueFuncOtherArgsMock = function(otherArg, key, cb) {
  cb(null, key + otherArg + '!');
};

var valueFuncErrorMock = function(key, cb) {
  cb(new Error());
};

describe('map-keys-to-key-value-pairs', function(){
  it('passes error to callback if valueFunc is not a function', function(){
    expect(function(){
      sut('notfunc');
    }).to.throw(Error);
  });
  it('passes error to callback if keys is not an array', function(){
    expect(function(){
      sut(function(){}, 'notarray');
    }).to.throw(Error);
  });
  it('passes error to callback if keys if otherArgs is passed and is not array', function(){
    expect(function(){
      sut(function(){}, [], 'notarray');
    }).to.throw(Error);
  });
  it('passes error to callback if keys if cb it not a function', function(){
    expect(function(){
      sut(function(){}, [], [], 'notafunc');
    }).to.throw(Error);
  });
  it('maps keys to key value pairs with no otherArgs passed', function(){
    sut(valueFuncMock, ['key1', 'key2'], function(err, result){
      expect(result).to.deep.equal([
        ['key1', 'key1!'],
        ['key2', 'key2!']
      ]);
    });
  });
  it('maps keys to key value pairs with otherArgs passed', function(){
    sut(valueFuncOtherArgsMock, ['ohyea'], ['key1', 'key2'], function(err, result){
      expect(result).to.deep.equal([
        ['key1', 'key1ohyea!'],
        ['key2', 'key2ohyea!']
      ]);
    });
  });
  it('valueFunc passes error to callback', function(){
    sut(valueFuncErrorMock, ['key1', 'key2'], function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
});