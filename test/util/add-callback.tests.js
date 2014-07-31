'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/util/add-callback';
var sut = require(sutPath);

describe('add-callback', function(){
  it('creates a new function that accepts a callback and passes result to cb', function(){
    var newFunc = sut(function(){
      return 1234;
    });
    newFunc(function(err, result){
      expect(err).to.be.null;
      expect(result).to.equal(1234);
    });
  });
  it('the new func still accepts params from original func', function(){
    var newFunc = sut(function(paramA, paramB){
      return paramA + paramB;
    });
    newFunc(1, 2, function(err, result){
      expect(err).to.be.null;
      expect(result).to.equal(3);
    });
  });
  it('just returns the original func result if no callback is passed', function(){
    var newFunc = sut(function(paramA, paramB){
      return paramA + paramB;
    });
    var result = newFunc(1, 2);
    expect(result).to.equal(3);
  });
  it('creates a new function that returns func if func param is not a function and no callback passed', function(){
    var newFunc = sut('notafunction');
    expect(newFunc()).to.equal('notafunction');
  });
  it('creates a new function that passes func to callback if func param is not a function', function(){
    var newFunc = sut('notafunction');
    newFunc(function(err, result){
      expect(err).to.be.null;
      expect(result).to.equal('notafunction');
    });
  });
});