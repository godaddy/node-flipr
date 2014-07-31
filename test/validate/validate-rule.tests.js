'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var sutPath = '../../lib/validate/validate-rule';

chai.use(sinonChai);

var sut = require(sutPath);
var rule;

describe('validate-rule', function(){
  beforeEach(function(){
    rule = {
      type: 'equal',
      input: 'someId',
      property: 'someProperty'
    };
  });

  it('calls the callback with nothing for valid input', function(){
    var cbSpy = sinon.spy();
    sut(rule, cbSpy);
    expect(cbSpy).to.be.calledWithExactly();
  });
  it('sends an error to callback if the rule does not have a type property', function(){
    delete rule.type;
    sut(rule, function(err, errors){
      expect(err).to.not.exist;
      expect(errors.length).to.equal(1);
    });
  });
  it('sends an error to callback if the rules does not have a valid type property', function(){
    rule.type = 'notvalid';
    sut(rule, function(err, errors){
      expect(err).to.not.exist;
      expect(errors.length).to.equal(1);
    });
  });
  it('sends an error to callback if the rule does not have an input property', function(){
    delete rule.input;
    sut(rule, function(err, errors){
      expect(err).to.not.exist;
      expect(errors.length).to.be.equal(1);
    });
  });
  it('sends an error to callback if input is not a string or function', function(){
    rule.input = {};
    sut(rule, function(err, errors){
      expect(err).to.not.exist;
      expect(errors.length).to.be.equal(1);
    });
  });
  it('sends an error to callback if rule type is not percent and does not have property property', function(){
    rule.type = 'equal';
    delete rule.property;
    sut(rule, function(err, errors){
      expect(err).to.not.exist;
      expect(errors.length).to.be.equal(1);
    });
  });
});
