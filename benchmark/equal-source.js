'use strict';

module.exports = {
  getConfig: function(cb) {
    cb(null, 
      {
        'testKey': {
          'description': 'Some test description',
          'values': [
            {
              'value': 1
            },
            {
              'value': 2,
              'isUserSpecial': true
            }
          ]
        }
      }
    );
  }
};