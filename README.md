node-flipr
============

[![NPM](https://nodei.co/npm/flipr.png?downloads=true&stars=true)](https://www.npmjs.org/package/flipr)

[![Build Status](https://travis-ci.org/godaddy/node-flipr.png)](https://travis-ci.org/godaddy/node-flipr)

Feature flipping and configuration using a flipr source (e.g. yaml files, etcd, database, etc.)

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
const Flipr = require('flipr');
const FliprYaml = require('flipr-yaml');

const source = new FliprYaml({
  filePath: './config/example.yaml',
});

const flipr = new Flipr({
  source,
});

flipr.getConfig()
  .then(
    config => console.log(config),
    err => console.log(err),
  );
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
const Flipr = require('flipr');
const FliprYaml = require('flipr-yaml');

const source = new FliprYaml({
  filePath: './config/example.yaml',
});

const flipr = new Flipr({
  source: source,
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
});

const input = {
  user: {
    userId: '293890'
  }
};

async function complexExample() {
  const config = await flipr.getConfig(input);
  console.log(config);
  const value = await flipr.getValue('someConfigKey', input);
  console.log(value);
}

complexExample().catch();
```

## What is a flipr source?
A flipr source is something that gives flipr configuration data using a specific schema, over a specific interface.  The format can be seen in the examples above.  Where does it get the data?  It's up to you.  There are some pre-built sources for flipr (see below), but you can easily create your own.  A flipr source should expose the following interface:
```javascript
module.exports = {
  async getConfig() { },
  async preload() { },
  async flush() { },
  async validateConfig(options) { },
};
```
* `getConfig`: This method should return the config as a JS object. This action should cache the config for subsequent calls.
* `preload`: This should load the config data and cache it.  This gives users the option to load the config during a warmup process.
* `flush`: This should flush all cached config data, so that the next call will grab it from the original source.
* `validateConfig`: Flipr provides some robust validation for its config data via the [flipr-validation library](https://github.com/godaddy/node-flipr-validation).  If the flipr source is reading from a static resource, like yaml files, you can use this to validate the config in your unit tests.  If the flipr source is reading from a dynamic resource, like etcd or a database, you'll want to use flipr-validation in the process that adds data to that resource, so that bad config doesn't get sent over to flipr.

### Available flipr sources
* [flipr-yaml](https://github.com/godaddy/node-flipr-yaml): Read flipr configuration from yaml files.
* **OUT OF DATE** [flipr-etcd](https://github.com/godaddy/node-flipr-etcd): This source is out of date, but remains as an example. This source will read configuration from [Etcd](https://github.com/coreos/etcd).  You should use this source if you want truly dynamic configuration.  Flipr will listen to Etcd and immediately pick up any changes.  Think about feature flags.  You turn a flag on, your application immediately responds to the change.  If you were using flipr-yaml, you would have to change the yaml file and re-deploy your application.

## Would you like to know [more](http://i.imgur.com/IOvYPfT.jpg)?
* [Basic example](/sample/basic.js)
* [Feature flipping](/sample/feature-flipping.js)
* [Using default values if rule match isn't found](/sample/default.js)
* [Forcing a preload/cache](/sample/preload.js)
* [Get a single static value](/sample/get-value.js)
* [Get a single dynamic value](/sample/get-dynamic-value.js)
* [Flushing cached config](/sample/flush-cache.js)

## Flipr Constructor Options
* `source` - _required_ - The source you want to use to retrieve config information.
* `rules` - _optional_ - array - The rules you want to use to drive your feature flipping and other dynamic configuration.  See below for further explanation.

## Flipr Rules

### Percent
The percent rule is used to change config values based on some percentage calculated using a unique identifier.  One common use for this rule is rolling out changes to an arbitrary percentage of users.  The example below shows how would you enable a feature for 15% of your users. Percents are cumulative, starting with the smallest percent and must add up to 100 for a single property, e.g. `1, 4, 95` would in reality be `0-1%, >1-5%, >5%-100%`.
```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      percent: 15
    - value: false
      percent: 85
```
```javascript
const rule = {
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
const rule = {
  type: 'list',
  input: 'user.state', //Input can be a nested property
  property: 'states'
};
```

### Equal
The equal rule is much like the list rule, except it only allows a single value instead of a list of values.  One common use for this rule would be enabling features based on a single user characteristic that only has a limited number of states (e.g. boolean).  The example below shows you how you would enable a feature for any user that has been using your application for a number years, and is over the age of 18.  This example also shows another feature of rules: the ability to accept a function in the input property.  Note: All three rules let you pass a function for input.
```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      isAdmin: true
    - value: false
```
```javascript
const someMinimumDate = new Date(2005, 1, 1);
const rule = {
  type: 'equal',
  input: (input) => {
    return input.user.startDate > someMinimumDate
      && input.user.age >= 18;
  },
  property: 'isAdmin'
};
```
The above example is contrived, but it shows how you can use input functions to calculate a complex set of criteria to power your config.  The `input` property is calculating a user's seniority and age, which is then represented in your config by a friendly identifier specified in `property`.

### Input as a function
You can define a function to transform the input sent to flipr to create some complex rules.  If you decide to use functions for a rule's input, be aware that that function should be as safe as possible.  If an exception is thrown by the input function, that rule will be silently skipped.

## Other Noteworthy Behavior
* Flipr deals with two different types of configuration data: static and dynamic.  Static configuration is created using the `value:` property, while dynamic is created using the `values:` property.  Static configuration doesn't change based on input, so the rules you define are ignored.  Dynamic configuration does change based on input.  Each time you pass input to flipr, it will run through the rules you have defined to determine the correct values.  While this is not an expensive operation, it would be a good idea to minimize the number of calls to flipr when getting dynamic configuration, especially if you have a large config.
* Values from input are compared to values in config by making them both strings and using a case-insensitive comparison.
  * You can force case sensitivity by setting the 'isCaseSensitive' property on the rule to true.
* Rules are executed in the order they are defined in the rules option.  If a match is found for a rule, it will skip the remaining rules and return the matched value.
* Generally, flipr sources should be caching any data they retrieve to build the config.  Once it's cached, you'll need to explicitly call flush on flipr to get any updated values (unless the source implements some sort of automatic flushing).
* Accessing config via flipr is treated as an asynchronous action, even if the source is synchronous.
