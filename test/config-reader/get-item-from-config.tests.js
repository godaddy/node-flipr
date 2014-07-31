'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/config-reader/get-item-from-config';
var sut = require(sutPath);

describe('get-item-from-config', function(){
  it('sends error to callback if config is not an object', function(){
    sut('somekey', 'notanobject', function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('sends error to callback if config[key] is not object', function(){
    sut('somekey', {someKey: 'noanobject'}, function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('sends config item to callback if config[key] found', function(){
    sut('somekey', {somekey: {someConfigItem: 'foo'}}, function(err, item){
      expect(err).to.be.null;
      expect(item).to.deep.equal({someConfigItem: 'foo'});
    });
  });
});