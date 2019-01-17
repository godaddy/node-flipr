const Flipr = require('../lib/flipr');
const source = require('./sources/feature-flipping-source');

const flipr = new Flipr({
  source,
  rules: [
    {
      type: 'equal',
      input: input => input.user.userId === '2tm',
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
    }
  ]
});

const input = {
  user: {
    userId:'2tm'
  }
};

async function getValueByRulesExample() {
  try {
    const value1 = await flipr.getValue('welcomeMessage', input);
    console.log(value1);
  } catch (err) {
    console.dir(err);
  }
}

getValueByRulesExample().catch();
