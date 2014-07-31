'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/config-reader/get-values-from-item';
var sut = require(sutPath);

describe('get-values-from-item', function(){
  it('sends error to callback if item is not an object', function(){
    sut('notanobject', function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('sends error to callback if item is not an array', function(){
    sut({values: 'notanarray'}, function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('sends true and item.value to callback if value found', function(){
    var values = [{value: 'blah'}];
    var item = {values:values};
    sut(item, function(err, result){
      expect(err).to.be.null;
      expect(result).to.equal(values);
    });
  });
});