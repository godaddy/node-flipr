'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sutPath = '../../lib/validate/validate-values';
var sut = require(sutPath);

describe('validate-values', function(){
  it('sends an error to callback if values object is not an array', function(){
    sut('testKey', 'notarray', function(err, errors){
      expect(err).to.be.null;
      expect(errors.length).to.equal(1);
    });
  });
  it('sends an error to callback if value is not an object', function(){
    sut('testKey', ['notobject'], function(err, errors){
      expect(err).to.be.null;
      expect(errors.length).to.equal(1);
    });
  });
  it('sends an error to callback if value property is missing', function(){
    sut('testKey', [{notvalue: 123 }], function(err, errors){
      expect(err).to.be.null;
      expect(errors.length).to.equal(1);
    });
  });
  it('sends an error to callback if value property is not set', function(){
    sut('testKey', [{value: void(0) }], function(err, errors){
      expect(err).to.be.null;
      expect(errors.length).to.equal(1);
    });
  });
  it('sends nothing to callback if values is valid', function(){
    var cbSpy = sinon.spy();
    sut('testKey', [{'value': 123 }], cbSpy);
    expect(cbSpy).to.be.calledWithExactly();
  });
});