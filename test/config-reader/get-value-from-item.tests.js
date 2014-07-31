'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/config-reader/get-value-from-item';
var sut = require(sutPath);

describe('get-value-from-item', function(){
  it('sends error to callback if item is not an object', function(){
    sut('notanobject', function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('sends item to callback if no value property', function(){
    var item = {notvalue:'blah'};
    sut(item, function(err, result){
      expect(err).to.be.null;
      expect(result).to.equal(item);
    });
  });
  it('sends true and item.value to callback if value found', function(){
    var item = {value:'blah'};
    sut(item, function(err, result){
      expect(err).to.be.true;
      expect(result).to.equal('blah');
    });
  });
});