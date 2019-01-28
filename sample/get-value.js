const Flipr = require('../lib/flipr');
const source = require('./sources/basic-source');

const flipr = new Flipr({
  source,
});

flipr.getValue('someNestedConfig').then(
  value => console.log(JSON.stringify(value, null, 2)),
  err => console.dir(err),
);
