const Flipr = require('../lib/flipr');
const source = require('./sources/feature-flipping-source');

const flipr = new Flipr({
  source,
  rules: [
    {
      type: 'equal',
      input: (input) => input.user.userId === '2tm',
      property: 'isUserSpecial',
    },
    {
      type: 'list',
      // You can use strings to access deep properties
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
    userId: '121212'
  }
};

// In feature-flipping.yaml, welcomeMessage is set up with a default
// value, which will be selected if the userId doesn't match the other
// values.
flipr.getValue('welcomeMessage', input)
  .then(
    value => console.log(value),
    err => console.dir(err),
  );