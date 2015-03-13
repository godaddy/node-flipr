'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sutPath = '../../lib/util/ignore-last-result';
var sut = require(sutPath);

describe('ignore-last-result', function(){
  it('calls provided cb with nothing', function(){
    var cbSpy = sinon.spy();
    sut('blah', cbSpy);
    expect(cbSpy).to.have.been.calledWith();
  });
});