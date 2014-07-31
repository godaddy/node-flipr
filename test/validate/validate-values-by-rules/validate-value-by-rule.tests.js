'use strict';

var chai = require('chai');
var expect = chai.expect;
var sut = require('../../../lib/validate/validate-values-by-rules/validate-value-by-rule');

describe('validate-value-by-rule', function(){
  it('returns untouched accumulator if value is not object', function(){
    var result = sut('someaccumulator',
      'notobject',
      'someindex',
      'somecollection',
      'somekey',
      'someproperty',
      'somerule');
    expect(result).to.equal('someaccumulator');
  });
  it('returns untouched accumulator if value does not have property', function(){
    var result = sut('someaccumulator',
      {someprop: ''},
      'someindex',
      'somecollection',
      'somekey',
      'notprop',
      'somerule');
    expect(result).to.equal('someaccumulator');
  });
  it('returns accumulator with no errors if no errors encountered', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:'blah'},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type:'equal'});
    expect(accumulator.errors).to.be.empty;
  });
  it('adds error to accumulator if value property does not have value', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:void(0)},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      'somerule');
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds error to accumulator if rule type is equal and property value is not string, number, or boolean', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:{}},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'equal'});
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds error to accumulator if rule type is list and property value is not array', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:'notarray'},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'list'});
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds error to accumulator if rule type is list and property value is array with at least one value that is not string, number, or boolean', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:['somevalue', {}]},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'list'});
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds error to accumulator if rule type is percent and property value is not number', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:'notnumber'},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'percent'});
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds error to accumulator if rule type is percent and property value is greater than 100', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:101},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'percent'});
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds error to accumulator if rule type is percent and property value is less than 0', function(){
    var accumulator = {
      errors: []
    };
    accumulator = sut(accumulator,
      {someprop:-1},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'percent'});
    expect(accumulator.errors.length).to.equal(1);
  });
  it('adds property value to percentTotalif rule type is percent', function(){
    var accumulator = {
      errors: [],
      percentTotal: 0
    };
    accumulator = sut(accumulator,
      {someprop:50},
      'someindex',
      'somecollection',
      'somekey',
      'someprop',
      {type: 'percent'});
    expect(accumulator.percentTotal).to.equal(50);
  });
});