'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/validate/validate-options';
var sut = require(sutPath);

describe('validate-options', function (){
  it('throws error if options is not an object', function(){
    expect(function(){
      sut('notobject');
    }).to.throw(Error);
  });
  it('throws error if options.source is not an object', function(){
    expect(function(){
      sut({
        source: 'notobject'
      });
    }).to.throw(Error);
  });
  it('does not throw error if options are valid', function(){
    expect(function(){
      sut({
        source: {}
      });
    }).to.not.throw();
  });
});