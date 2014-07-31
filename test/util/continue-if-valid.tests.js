'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/continue-if-valid';
var sut = require(sutPath);

describe('continue-if-valid', function(){
  it('calls callback with no args if isValid is true', function(){
    sut(true, function(){
      expect(arguments.length).to.equal(0);
    });
  });
  it('calls callback with error if isValid is false', function(){
    sut(false, function(err){
      expect(err).to.be.instanceof(Error);
    });
  });
});