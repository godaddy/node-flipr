'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/validate/validate-config-item';
var sut = require(sutPath);

describe('validate-config-item', function(){
  it('sends validation error to callback if the config item is not an object', function(){
    sut('testKey', 'notobject', function(err, error){
      expect(err).to.be.null;
      expect(error.length).to.equal(1);
    });
  });
  it('sends validation error to callback if item has both value and values properties', function(){
    sut('testKey', {value: 'some value', values: []}, function(err, error){
      expect(err).to.be.null;
      expect(error.length).to.equal(1);
    });
  });
  it('sends validation error to callback if the value of value is undefined', function(){
    sut('testKey', {value: void(0)}, function(err, error){
      expect(err).to.be.null;
      expect(error.length).to.equal(1);
    });
  });
  it('does not throw any error for valid config item', function(){
    sut('testKey', {value: 'test value'}, function(err, error){
      expect(err).to.be.undefined;
      expect(error).to.be.undefined;
    });
  });
});