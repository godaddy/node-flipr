'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/end-waterfall-without-result';
var sut = require(sutPath);

describe('end-waterfall-without-result', function(){
  it('returns a function', function(){
    var result = sut();
    expect(result).to.be.a.func;
  });
  describe('returned function', function(){
    it('calls callback with no args if endReason is true', function(){
      var result = sut(function(){
        expect(arguments.length).to.equal(0);
      });
      result(true);
    });
    it('calls callback with endReason if endReason is truthy but not true', function(){
      var result = sut(function(endReason){
        expect(endReason).to.equal('blah');
      });
      result('blah');
    });
    it('calls callback with result if above cases are not met', function(){
      var result = sut(function(endReason, result){
        expect(endReason).to.null;
        expect(result).to.equal('result');
      });
      result(null, 'result');
    });
  });
});