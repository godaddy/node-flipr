'use strict';

var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var sutPath = '../../lib/rules/get-input-from-rule';
chai.use(sinonChai);

var objectPathMock;
var sutProxy;

describe('get-input-from-rule', function(){
  beforeEach(function(){
    objectPathMock = {
      get: sinon.stub().returns('valueFromObjectPath')
    };
    sutProxy = proxyquire(sutPath, {
      'object-path': objectPathMock
    });
  });
  it('passes input to rule.input and returns String(result) if rule.input is a function', function(){
    var rule = {
      input: function(input) {
        return input.userId + 1;
      }
    };
    var result = sutProxy({userId: 1234}, rule);
    expect(result).to.equal('1235');
  });
  it('passes input to rule.input and returns lowercased String(result) if rule.input is a function', function(){
    var rule = {
      input: function(input) {
        return input.userId;
      }
    };
    var result = sutProxy({userId: 'FOO'}, rule);
    expect(result).to.equal('foo');
  });
  it('passes input to rule.input and returns String(result) without lowerCasing if rule.input is a function and rule.isCaseSensitive is true', function(){
    var rule = {
      input: function(input) {
        return input.userId;
      },
      isCaseSensitive: true
    };
    var result = sutProxy({userId: 'FOO'}, rule);
    expect(result).to.equal('FOO');
  });
  it('returns undefined if rule.input is a function that returns something that is not a string, boolean, or number', function(){
    var rule = {
      input: function() {
        return {};
      }
    };
    var result = sutProxy({userId: 'FOO'}, rule);
    expect(result).to.undefined;
  });
  it('returns undefined if rule.input is a function that throws an error', function(){
    var rule = {
      input: function() {
        throw new Error();
      }
    };
    var result = sutProxy({userId: 'FOO'}, rule);
    expect(result).to.undefined;
  });
  it('passes input and rule.input to objectPath, gets back lowercased String(result)', function(){
    var input = {
      user: { userId: 1234 }
    };
    var rule = {
      input: 'user.userId'
    };
    var result = sutProxy(input, rule);
    expect(objectPathMock.get).to.have.been.calledWith(input, rule.input);
    expect(result).to.equal('valuefromobjectpath');
  });
  it('passes input and rule.input to objectPath, gets back String(result) that is not lowercased, if rule.isCaseSensitive is true', function(){
    var input = {
      user: { userId: 1234 }
    };
    var rule = {
      input: 'user.userId',
      isCaseSensitive: true
    };
    var result = sutProxy(input, rule);
    expect(objectPathMock.get).to.have.been.calledWith(input, rule.input);
    expect(result).to.equal('valueFromObjectPath');
  });
  it('returns undefined if objectPath returns undefined', function(){
    objectPathMock.get.returns(void(0));
    var input = {
      user: { userId: 1234 }
    };
    var rule = {
      input: 'user.userId'
    };
    var result = sutProxy(input, rule);
    expect(result).to.undefined;
  });
});