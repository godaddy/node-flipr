const Flipr = require('../lib/flipr');
const flipr = new Flipr({
  source: require('./sources/basic-source')
});

flipr.getConfig().then(
  config => console.log(JSON.stringify(config, null, 2)),
  err => console.dir(err),
);