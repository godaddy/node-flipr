'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var sutPath = '../../lib/validate/validate-key';

chai.use(sinonChai);

var sut = require(sutPath);

describe('validate-key', function (){
  it('sends error to callback if key is not a string', function(){
    sut(1234, function(err){
      expect(err).to.be.instanceOf(Error);
    });
  });
  it('sends nothing to callback if key is valid', function(){
    var cbSpy = sinon.spy();
    sut('somekey', cbSpy);
    cbSpy.calledWithExactly();
  });
});