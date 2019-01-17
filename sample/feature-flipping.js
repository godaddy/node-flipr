const Flipr = require('../lib/flipr');
const source = require('./sources/feature-flipping-source');

const flipr = new Flipr({
  source,
  // rules execute in the order they are defined.
  // if a match is found by a rule,
  // the rest of the rules will be ignored for
  // that config item.
  rules: [
    {
      type: 'equal',
      input: function(input){
        return input.user.userId === '2tm';
      },
      property: 'isUserSpecial'
    },
    {
      type: 'list',
      //You can use strings to access deep properties
      input: 'user.userId',
      property: 'userIds'
    },
    {
      type: 'percent',
      input: 'user.userId'
    },
    {
      type: 'equal',
      //This property won't exist on the sample 
      //inputs below.  So this rule will be ignored.
      input: 'user.notUserId',
      property: 'notUsed'
    }
  ]
});

const sampleInput1 = {
  user: {
    userId: '30048'
  }
};
const sampleInput2 = {
  user: {
    userId: '2tm'
  }
};

// This shows what % a user's id falls under
// when calculating config values based on %
console.log(`sampleInput1.user.userId % ${Flipr.idToPercent(sampleInput1.user.userId)}`);
console.log(`sampleInput2.user.userId % ${Flipr.idToPercent(sampleInput2.user.userId)}`);

async function featureFlippingExample() {
  try {
    const config1 = await flipr.getConfig(sampleInput1);
    console.log('\nConfig for sampleInput1');
    console.log(JSON.stringify(config1, null, 2));

    const config2 = await flipr.getConfig(sampleInput2);
    console.log('\nConfig for sampleInput2');
    console.log(JSON.stringify(config2, null, 2));
  } catch (err) {
    console.dir(err);
  }
}

featureFlippingExample().catch()
