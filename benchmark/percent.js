const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const Flipr = require('../lib/flipr');

const input = {
  user: {
    userId: '1234'
  }
};
const rules = [{
  type: 'percent',
  input: 'user.userId'
}];

suite
  .add('flipr#percentx1', (deferred) => {
    const flipr = new Flipr({
      source: require('./percent-source'),
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
  .add('flipr#percentx10', (deferred) => {
    const flipr = new Flipr({
      source: require('./percent-x-10-source'),
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
  .add('flipr#percentx20', (deferred) => {
    const flipr = new Flipr({
      source: require('./percent-x-20-source'),
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
    console.log('Starting percent benchmarks...');
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', () => { 
    console.log('Finished percent benchmarks.');
  })
  .run({'async':true});
