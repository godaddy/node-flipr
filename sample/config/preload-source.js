'use strict';

//This is a source shim to feed sample data to flipr.
//Normally, you would be using a real flipr source to pull
//data from somewhere, e.g. flipr-yaml to pull from 
//local yaml files.

module.exports = {
  getConfig: function(cb){
    cb(null, {
      'secretServiceUrl': {
        'value': 'http://www.godaddy.com/secretservice'
      },
      'someTimeout': {
        'value': 0
      },
      'someNestedConfig': {
        'value': {
          'favoriteNumbers': [7, 11, 13, 42],
          'address': {
            'street': '123 Fake Street',
            'city': 'Gilbert',
            'state': 'Arizona'
          }
        }
      }
    });
  },
  preload: function(cb) {
    console.log('Source has been preloaded!');
    cb();
  }
};