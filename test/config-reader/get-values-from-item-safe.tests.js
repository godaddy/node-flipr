'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/config-reader/get-values-from-item-safe';
var sut = require(sutPath);

describe('get-values-from-item-safe', function(){
  it('sends error to callback if item is not an object', function(){
    sut('notobject', function(endReason){
      expect(endReason).to.be.instanceof(Error);
    });
  });
  it('sends true to cb if item.values is undefined', function(){
    sut({values:void(0)}, function(endReason){
      expect(endReason).to.be.true;
    });
  });
  it('sends values to cb if item.values is not undefined', function(){
    sut({values:'values'}, function(endReason, values){
      expect(endReason).to.be.null;
      expect(values).to.equal('values');
    });
  });
});