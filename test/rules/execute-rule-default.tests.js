'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/rules/execute-rule-default';
var sut = require(sutPath);

describe('execute-rule-default', function(){
  it('calls callback with no args if values is not an array', function(){
    sut('notarray', function(){
      expect(arguments.length).to.equal(0);
    });
  });
  it('calls callback with no args if values is empty array', function(){
    sut([], function(){
      expect(arguments.length).to.equal(0);
    });
  });
  it('sends true and item value to callback for values item that has only a single property named value', function(){
    var values = [
      {
        value: 'foo',
        someOtherProp: 'blah'
      },
      {
        value: 'bar'
      }
    ];
    sut(values, function(endReason, result){
      expect(endReason).to.be.true;
      expect(result).to.equal('bar');
    });
  });
  it('sends no args to callback if values items all have more than one property', function(){
    var values = [
      {
        value: 'foo',
        someOtherProp: 'blah'
      },
      {
        value: 'bar',
        anotherProp: 'blah'
      }
    ];
    sut(values, function(){
      expect(arguments.length).to.equal(0);
    });
  });
  it('sends no args to callback for values item that has only a single property NOT named value', function(){
    var values = [
      {
        value: 'foo',
        someOtherProp: 'blah'
      },
      {
        notvalue: 'bar'
      }
    ];
    sut(values, function(){
      expect(arguments.length).to.equal(0);
    });
  });
});