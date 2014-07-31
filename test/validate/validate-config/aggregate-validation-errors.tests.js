'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../../lib/validate/validate-config/aggregate-validation-errors';
var sut = require(sutPath);

describe('async-error-handler', function(){
  it('sends err to callback if err has some value', function(){
    sut('some_error', null, function(err){
      expect(err).to.equal('some_error');
    });
  });

  it('flattens and compacts errors', function(){
    sut(undefined, ['error1', ['error2', void(0)]], function(err, result){
      expect(err).to.be.null;
      expect(result).to.deep.equal(['error1', 'error2']);
    });
  });

  it('sends nothing to callback if no errors found', function(){
    sut(undefined, undefined, function(err, result){
      expect(err).to.be.undefined;
      expect(result).to.be.undefined;
    });
  });
});