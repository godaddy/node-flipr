'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/rules/execute-rule-list';
var sut = require(sutPath);

var input;
var rule;
var values;

describe('execute-rule-list', function(){
  beforeEach(function(){
    input = 'blah';
    rule = {
      type: 'list',
      property: 'userIds'
    };
    values = [{
      value: 1,
      userIds: ['notblah', 'notblah2']
    }, {
      value: 2,
      userIds: 'notarray'
    }, {
      value: 3,
      userIds: void(0)
    }, {
      value: 4,
      userIds: ['blahblah', 'blah']
    }];
  });
  it('calls callback with true and value if input matches value based on rule', function(){
    sut(input, rule, values, function(endReason, value){
      expect(endReason).to.be.true;
      expect(value).to.equal(4);
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