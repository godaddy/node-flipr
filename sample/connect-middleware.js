'use strict';

var flipr = require('../lib/flipr');

/*
* This will make the flipr config dictionary available
* at req.config for all routes.  The dictionary will be based on
* the current req.  If for some reason we can't retrieve
* user identity out of req, it will only return the static
* dictionary.
*/

module.exports = function(app) {
  //You can use app.all if you want to have
  //this middleware run after all use/param middleware.
  app.use(flipr.init({
    source: require('./config/feature-flipping-source'),
    //Moving the rules into a seprate file will help keep
    //things more organized, while allowing you to reference
    //the rules in other areas of your application 
    //(e.g. validation unit tests)
    rules: [
      {
        type: 'list',
        input: 'user.userId',
        property: 'userIds'
      }
    ]
  }));
};