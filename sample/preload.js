const Flipr = require('../lib/flipr');
const source = require('./sources/preload-source');

const flipr = new Flipr({
  source,
});

flipr.preload().then(() => {
  console.log('Config has been received and cached!');
});