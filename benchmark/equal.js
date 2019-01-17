const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const Flipr = require('../lib/flipr');

const input = {
  user: {
    userId: '2tm'
  }
};
const rules = [{
  type: 'equal',
  input: input => {
    return input.userId === '2tm';
  },
  property: 'isUserSpecial'
}];

suite
  .add('flipr#equalx1', deferred => {
    const flipr = new Flipr({
      source: require('./equal-source'),
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
  .add('flipr#equalx10', (deferred) => {
    const flipr = new Flipr({
      source: require('./equal-x-10-source'),
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
  .add('flipr#equalx20', (deferred) => {
    const flipr = new Flipr({
      source: require('./equal-x-20-source'),
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
    console.log('Starting equal benchmarks...');
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('Finished equal benchmarks.');
  })
  .run({async:true});
