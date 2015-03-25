node-flipr
============

[![NPM](https://nodei.co/npm/flipr.png?downloads=true&stars=true)](https://www.npmjs.org/package/flipr)

[![Build Status](https://travis-ci.org/godaddy/node-flipr.png)](https://travis-ci.org/godaddy/node-flipr)

**Stability: 1 - Experimental** 

Feature flipping and configuration using a flipr source (e.g. yaml files, etcd, database, etc.)

For v0, see [this branch](https://github.com/godaddy/node-flipr/tree/v0).

![node-flipr](/flipr.png?raw=true "node-flipr")

## How does it work?
### Here's the simplest example using a yaml source:
```yaml
---
# Here's a basic YAML config file. Assume it is loaded by the source.
someConfigKey:
  description: >
    This is some config key that has some value.
  value: someValue
```

```javascript
var yamlSource = require('./my-yaml-source');
var flipr = require('flipr');
flipr.init({
  source: yamlSource
});
flipr(function(err, config){
  console.dir(config);
});
```
### Here's a more complex example using a yaml source:
```yaml
---
someConfigKey:
  description: >
    This is some config key that has multiple values
    that change based on the user/request context.
  values:
    - value: someValue
      isUserSpecial: true
      percent: 25
    - value: someOtherValue
      userIds:
        - 1234
        - 5678
      percent: 75
```

```javascript
var yamlSource = require('./my-yaml-source');
var flipr = require('flipr');
flipr.init({
  source: yamlSource
  rules: [
    {
      type: 'equal',
      input: function(input){
        return input.user.userId === '1234';
      },
      property: 'isUserSpecial'
    },
    {
      type: 'list',
      input: 'user.userId',
      property: 'userIds'
    },
    {
      type: 'percent',
      input: 'user.userId',
    }
  ]
})

var input = {
  user: {
    userId: '293890'
  }
};
flipr(input, function(err, config){
    console.dir(config);
});

```

## What is a flipr source?
Good question.  A flipr source is something that gives flipr configuration data using a specific format, over a specific interface.  The format can be seen in the examples above.  Where does it get the data?  It's up to you.  There are some pre-built sources for flipr (see below), but you can easily create your own.  A flipr source should expose the following interface:
```javascript
module.exports = {
  getConfig: function(cb){ }, //required
  preload: function(cb){ }, //optional, but recommended
  flush: function(){ } //optional, but recommended
  validateConfig: function(options, cb){ } //optional
}
```
* `getConfig`: This method should pass the config as a JS object to the callback.  Callback signature is `function(err, result)`.  This action should cache the config.
* `preload`: This should load the config data and cache it.  This gives users the option to load the config during a warmup process.  Should call the callback when finished, passing an error if something went wrong.
* `flush`: This should flush all cached config data, so that the next call will grab it from the original source.  Flush doesn't have to be a synchronous action, but if it isn't, be aware that there may still be calls after the flush that are grabbing the old config.
* `validateConfig`: Flipr provides some robust validation for its config data via the flipr-validation package.  If your flipr source is reading from a static resource, like yaml files, you'll want to expose validateConfig on the source so that users can validate the config in their unit tests.  If your flipr source is reading from a dynamic resource, like etcd or a database, you'll want to use flipr-validation in the process that adds data to that resource, so that bad config doesn't get sent over to flipr.

### Available flipr sources
* [flipr-yaml](https://github.com/godaddy/node-flipr-yaml): This source will act much like flipr v0 did, reading configuration from yaml files.
* [flipr-etcd](https://github.com/godaddy/node-flipr-etcd): This source will read configuration from [Etcd](https://github.com/coreos/etcd).  You should use this source if you want truly dynamic configuration.  Flipr will listen to Etcd and immediately pick up any changes.  Think about feature flags.  You turn a flag on, your application immediately responds to the change.  If you were using flipr-yaml, you would have to change the yaml file and re-deploy your application.

## Would you like to know [more](http://i.imgur.com/IOvYPfT.jpg)?
* [Basic example](/sample/basic.js)
* [Feature flipping](/sample/feature-flipping.js)
* [Using default values if rule match isn't found](/sample/default.js)
* [Environment-aware configuration files](/sample/environment-awareness.js)
* [Integrating with express/connect via middleware](/sample/connect-middleware.js)
* [Validating input to flipr](/sample/validate-input.js)
* [Validating config files](/sample/validate-config.js)
* [Forcing a preload/cache](/sample/preload.js)
* [Get a single static value](/sample/get-value.js)
* [Get a single dynamic value](/sample/get-value-by-rules.js)
* [Flushing cached config](/sample/flush-cache.js)

## Flipr Init Options
* `source` - _required_ - The source you want to use to retrieve config information.  Sources have their own init options, see their readme's for usage details.
* `inputValidator` - _optional_ - (function(input, cb)) - Flipr uses inputValidator to test the validity of the input it receives before it tries to use that input to retrieve config based on the rules you've defined.  If you're using the connect middleware, the inputValidator decides whether to retrieve the dyanmic or static configuration, based on the validity of the input.  If you're calling flipr.getDictionaryByRules explicity, then an error will be returned in the case of invalid input.  Check out [this example](/sample/validate-input.js);
* `rules` - _optional_ - array - The rules you want to use to drive your feature flipping and other dynamic configuration.  See below for more explanation.

## Flipr Rules

### Percent
The percent rule is used to change config values based on some percentage calculated using a unique identifier.  One common use for this rule is rolling out changes to an arbitrary percentage of users.  The example below shows how would you enable a feature for 15% of your users.
```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      percent: 15
    - value: false
      percent: 85
```
```javascript
var rule = {
  type: 'percent',
  input: 'user.id'
};
```

### List
The list rule allows you to change config values based on some list of allowed values.  One common use for this rule would be enabling features for specific users or groups of users.  The example below shows you how you would enable a feature for any users living in Arizona or California.
```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      states:
        - AZ
        - CA
    - value: false
```
```javascript
var rule = {
  type: 'list',
  input: 'user.state', //Input can be a nested property
  property: 'states'
};
```

### Equal
The equal rule is much like the list rule, except it only allows a single value instead of a list of values.  One common use for this rule would be enabling features based on a single user characteristic that only has a limited number of states (e.g. boolean).  The example below shows you how you would enable a feature for any user that has been using your application for a many years, and is over the age of 18.  This example also debuts another feature of rules: the ability to accept a function in the input property.  Note:  All three rules let you do pass a function for input.
```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      isAdmin: true
    - value: false
```
```javascript
var rule = {
  type: 'list',
  input: function(input) {
    return input.user.startDate > new Date(2005, 1, 1) 
      && input.user.age >= 18;
  },
  property: 'isAdmin'
};
```
The above example is a little contrived, but it shows how you can use input functions to calculate a complex set of criteria to power your config.  The `input` property is calculating a user's seniority and age, which is then represented in your config by a friendly identifier specified in `property`.

### Input as a function
The Equal rule example located above shows you that you can define a funtion to transform the input sent to flipr to create some complex rules.  If you decide to use functions for a rule's input, be aware that that function should be as safe as possible.  If an exception is thrown by the input function, that rule will be silently skipped.  You can use flipr's [input validation functionality](/sample/validate-input.js) to help catch edge cases that would cause any exceptions in your input functions.

## Other Noteworthy Behavior
* Flipr deals with two different types of configuration data: static and dynamic.  Static configuration is created using the `value:` property, while dyanmic is created using the `values:` property.  Static configuration doesn't change based on input, so the rules you define are ignored, and it is cached after the first read.  Dynamic configuration does change based on input and is not cached.  Each time you pass input to flipr, it will run through the rules you have defined to determine the correct values.  While this is not an expensive operation, it would be a good idea to limit the number of calls to flipr when getting dynamic configuration, especially if you have a large config.
* Values from input are compared to values in config by making them both strings and using a case-insensitive comparison.
  * You can force case sensitivity by setting the 'isCaseSensitive' property on the rule to true.
* Rules are executed in the order they are defined in the rules option.  If a match is found for a rule, it will skip the remaining rules and return the matched value.
* Generally, flipr sources should be caching any data they retrieve to build the config.  Once it's cached, you'll need to explicitly call flush on flipr to get any updated values (unless the source implements some sort of automatic flushing).
* Accessing config via flipr is treated as an asynchornous action, even if the source is synchronous.
