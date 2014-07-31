'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/end-waterfall';
var sut = require(sutPath);

describe('end-waterfall', function(){
  it('returns function', function(){
    expect(sut()).to.be.a.func;
  });
  describe('returned function', function(){
    it('returns result if endReason is true', function(){
      var func = sut(function(err, result){
        expect(result).to.equal('blah');
      });
      func(true, 'blah');
    });
    it('returns error if endReason is error', function(){
      var func = sut(function(err){
        expect(err).to.be.instanceOf(Error);
      });
      func(new Error());
    });
    it('returns result if no endReason', function(){
      var func = sut(function(err, result){
        expect(result).to.equal('blah');
      });
      func(null, 'blah');
    });
  });
});