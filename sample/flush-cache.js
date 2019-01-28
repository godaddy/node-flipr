const Flipr = require('../lib/flipr');
const source = require('./sources/flushable-source');

const flipr = new Flipr({
  source,
});

// this is async, you can wait for it to finish
async function flushExample() {
  await flipr.flush();
  console.log(`The next call to flipr will get a fresh config from the source.`);    
}

flushExample().catch();
