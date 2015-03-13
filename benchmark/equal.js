'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();
var flipr = require('../lib/flipr');

var input = {
  user: {
    userId: '2tm'
  }
};
var rules = [{
  type: 'equal',
  input: function(input) {
    return input.userId === '2tm';
  },
  property: 'isUserSpecial'
}];

//We need these setup flags because benchmark.js doesn't
//have an async setup method for benchmarks, and we don't
//want to setup each time we run the test.
var x1Setup = false;
var x10Setup = false;
var x20Setup = false;

suite
  .add('flipr#equalx1', function(deferred){
    if(!x1Setup) {
      flipr.init({
        source: require('./equal-source'),
        rules: rules
      });
      x1Setup = true;
    }
    callFlipr(input, deferred);
  }, {defer: true})
  .add('flipr#equalx10', function(deferred){
    if(!x10Setup) {
      flipr.init({
        source: require('./equal-x-10-source'),
        rules: rules
      });
      x10Setup = true;
    }
    callFlipr(input, deferred);
  }, {defer:true})
  .add('flipr#equalx20', function(deferred){
    if(!x20Setup) {
      flipr.init({
        source: require('./equal-x-20-source'),
        rules: rules
      });
      x20Setup = true;
    }
    callFlipr(input, deferred);
  }, {defer:true})
  .on('start', function(){
    console.log('Starting equal benchmarks...');
  })
  .on('cycle', function(event){
    console.log(String(event.target));
  })
  .on('complete', function(){
    console.log('Finished equal benchmarks.');
  })
  .run({async:true});

function callFlipr(input, deferred) {
  flipr(input, function(err){
    if(err)
      console.dir(err);
    deferred.resolve();
  });
}