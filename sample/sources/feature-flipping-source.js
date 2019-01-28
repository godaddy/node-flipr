// This is a source shim to feed sample data to flipr.
// Normally, you would be using a real flipr source to pull
// data from somewhere, e.g. flipr-yaml to pull from 
// local yaml files.

module.exports = {
  async getConfig() {
    return {
      printMoneyFeature: {
        description: 'This feature allows our users to print money. The values are the dollar amounts they are allowed to print.\n',
        values: [
          {
            value: 10,
            percent: 60
          },
          {
            value: 50,
            percent: 20
          },
          {
            value: 100,
            percent: 19
          },
          {
            value: 1000000,
            percent: 1
          }
        ]
      },
      welcomeMessage: {
        description: 'This message shows to users when they launch our application.\n',
        values: [
          {
            value: 'Hello Employee.',
            isUserSpecial: true
          },
          {
            value: 'Hello Customers.',
            userIds: [
              938902,
              38593,
              30048
            ],
            notUsed: 'Ignore me'
          },
          {
            value: 'Hello Everyone Else.'
          }
        ]
      },
      someOtherThing: {
        description: 'This is some other thing.  It\'s different than the other things.\n',
        values: [
          {
            value: 'Some value',
            percent: 50,
            isUserSpecial: true,
            userIds: [
              30048,
              48398
            ]
          },
          {
            value: 'Other value',
            percent: 50,
            userIds: [
              298990,
              '2tm',
              304992
            ],
            notUsed: 'Ignore me'
          }
        ]
      }
    };
  }
};