'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var flipr = require('../lib/flipr');

var input = {
  user: {
    userId: '5555555'
  }
};
var rules = [{
  type: 'list',
  input: 'user.userId',
  property: 'userIds'
}];

//We need these setup flags because benchmark.js doesn't
//have an async setup method for benchmarks, and we don't
//want to setup each time we run the test.
var x1Setup = false;
var x10Setup = false;
var x20Setup = false;

suite
  .add('flipr#listx1', function(deferred){
    if(!x1Setup) {
      flipr.init({
        source: require('./list-source'),
        rules: rules
      });
      x1Setup = true;
    }
    callFlipr(input, deferred);
  }, {defer: true})
  .add('flipr#listx10', function(deferred){
    if(!x10Setup) {
      flipr.init({
        source: require('./list-x-10-source'),
        rules: rules
      });
      x10Setup = true;
    }
    callFlipr(input, deferred);
  }, {defer:true})
  .add('flipr#listx20', function(deferred){
    if(!x20Setup) {
      flipr.init({
        source: require('./list-x-20-source'),
        rules: rules
      });
      x20Setup = true;
    }
    callFlipr(input, deferred);
  }, {defer:true})
  .on('start', function(){
    console.log('Starting list benchmarks...');
  })
  .on('cycle', function(event){
    console.log(String(event.target));
  })
  .on('complete', function(){
    console.log('Finished list benchmarks.');
  })
  .run({'async':true});

function callFlipr(input, deferred) {
  flipr(input, function(err){
    if(err)
      console.dir(err);
    deferred.resolve();
  });
}