'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/rules/execute-rule-equal';
var sut = require(sutPath);

var input;
var rule;
var values;

describe('execute-rule-equal', function(){
  beforeEach(function(){
    input = 'blah';
    rule = {
      type: 'equal',
      property: 'userId'
    };
    values = [{
      value: 1,
      userId: 'notblah'
    }, {
      value: 2
    }, {
      value: 3,
      userId: 'blah'
    }];
  });
  it('calls callback with true and value if input matches value based on rule', function(){
    sut(input, rule, values, function(endReason, value){
      expect(endReason).to.be.true;
      expect(value).to.equal(3);
    });
  });
  it('calls callback with no args if no match based on case sensitive rule', function(){
    rule.isCaseSensitive = true;
    input = input.toUpperCase();
    sut(input, rule, values, function(){
      expect(arguments.length).to.equal(0);
    });
  });
});