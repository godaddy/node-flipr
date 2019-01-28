const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const Flipr = require('../lib/flipr');

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

suite
  .add('flipr#listx1', (deferred) => {
    const flipr = new Flipr({
      source: require('./list-source'),
      rules: rules,
    });
    flipr.getConfig(input).then(
      () => deferred.resolve(),
      err => {
        console.dir(err);
        deferred.resolve();
      },
    );
  }, {defer: true})
  .add('flipr#listx10', (deferred) => {
    const flipr = new Flipr({
      source: require('./list-x-10-source'),
      rules: rules,
    });
    flipr.getConfig(input).then(
      () => deferred.resolve(),
      err => {
        console.dir(err);
        deferred.resolve();
      },
    );
  }, {defer:true})
  .add('flipr#listx20', (deferred) => {
    const flipr = new Flipr({
      source: require('./list-x-20-source'),
      rules: rules,
    });
    flipr.getConfig(input).then(
      () => deferred.resolve(),
      err => {
        console.dir(err);
        deferred.resolve();
      },
    );
  }, {defer:true})
  .on('start', () => {
    console.log('Starting list benchmarks...');
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Finished list benchmarks.');
  })
  .run({'async':true});
