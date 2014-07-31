'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire');
var sutPath = '../../lib/util/async-memoize-with-flush';
chai.use(sinonChai);

var sutProxy;
var asyncMock;

describe('config-reader', function(){
  before(function(){
    asyncMock = require('async');
    sinon.spy(asyncMock, 'memoize');
  });
  beforeEach(function(){
    asyncMock.memoize.reset();
    sutProxy = proxyquire(sutPath, {
      'async': asyncMock
    });
  });
  it('throws error if func is not a function', function(){
    expect(function(){
      sutProxy('notafunc');
    }).to.throw(Error);
  });
  it('throws error if memoHasher is not undefined, a function, or a string', function(){
    expect(function(){
      sutProxy(function(){}, 1234);
    }).to.throw(Error);
  });
  it('calls async.memoize with memoHasher passed as function', function(){
    var func = function(){};
    var memoHasher = function(){};
    sutProxy(func, memoHasher);
    expect(asyncMock.memoize).to.have.been.calledWith(func, memoHasher);
  });
  it('calls async.memoize with memoHasher passed as undefined', function(){
    var func = function(){};
    sutProxy(func);
    expect(asyncMock.memoize).to.have.been.calledWith(func, void(0));
  });
  it('calls async.memoize with wrapped memoHasher passed as string', function(){
    var func = function(){};
    var memoHasher = 'blah';
    sutProxy(func, memoHasher);
    expect(asyncMock.memoize).to.have.been.calledWith(func, sinon.match.func);
    expect(asyncMock.memoize.args[0][1]()).to.equal(memoHasher);
  });
  it('returned func is memoized and flushable', function(done){
    var func = function(cb){
      cb(null, Math.random());
    };
    var memoHasher = 'blah';
    var memoizedFunc = sutProxy(func, memoHasher);
    var result1;
    var result2;
    var result3;
    memoizedFunc(function(err1, value1){
      result1 = value1;
      memoizedFunc(function(err2, value2){
        result2 = value2;
        memoizedFunc.flush();
        memoizedFunc(function(err3, value3){
          result3 = value3;
          expect(result1).to.equal(result2);
          expect(result3).to.not.equal(result2);
          done();
        });
      });
    });
  });
});