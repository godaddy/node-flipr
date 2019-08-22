# node-flipr

[![NPM](https://nodei.co/npm/flipr.png?downloads=true&stars=true)](https://www.npmjs.org/package/flipr)

[![Build Status](https://travis-ci.org/godaddy/node-flipr.png)](https://travis-ci.org/godaddy/node-flipr)

Static and dynamic configuration for Node.js applications.

Great for feature flags, authorization, A/B tests, dynamic routing, service discovery, and other things.

![node-flipr](/flipr.png?raw=true "node-flipr")

Checkout out our [blog article](https://www.godaddy.com/engineering/2019/03/06/dynamic-configuration-for-nodejs/) to learn more about why flipr exists.

## How does it work?

### Simple static configuration example using a yaml source
```yaml
---
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

console.log(await flipr.getConfig());
// { "someConfigKey": "someValue" }
```

### Complex dynamic configuration example using a yaml source
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

const rules = [
  {
    type: 'equal',
    input: (input) => input.user.userId === '1234',
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
];
const source = new FliprYaml({
  filePath: './config/example.yaml',
});
const flipr = new Flipr({
  source,
  rules,
});

const input = {
  user: {
    userId: '1234'
  }
};

console.log(await flipr.getValue('someConfigKey', input));
// someValue
```

## What is a flipr source?

A flipr source is something that gives flipr configuration data using a known schema over a known interface. The schema can be seen in the examples above.  Where does it get the data?  It's up to you.  There are some pre-built sources for flipr (see below), but you can easily create your own.  A flipr source should expose the following interface:
```javascript
module.exports = {
  async getConfig() { },
  async preload() { },
  async flush() { },
  async validateConfig(options) { },
};
```
* `getConfig`: This method should return the config as an object. This action should cache the config for subsequent calls.
* `preload`: This should load the config data and cache it.  This gives users the option to load the config during a warmup process.
* `flush`: This should flush all cached config data, so that the next call will grab it from the original source.
* `validateConfig`: Flipr provides some robust validation for its config data via the [flipr-validation library](https://github.com/godaddy/node-flipr-validation).  If the flipr source is reading from a static resource, like yaml files, you can use this to validate the config in your unit tests.  If the flipr source is reading from a dynamic resource, like etcd or a database, you'll want to use flipr-validation in the process that adds data to that resource, so that bad config doesn't get sent over to flipr.

### Available flipr sources

* [flipr-yaml](https://github.com/godaddy/node-flipr-yaml): Read flipr configuration from yaml files.
* **OUT OF DATE** [flipr-etcd](https://github.com/godaddy/node-flipr-etcd): This source is out of date, but remains as an example. This source will read configuration from [Etcd](https://github.com/coreos/etcd).  You should use this source if you want dynamic configuration that not only changes based on input, but can also be updated externally without redeploying your applications.

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
* `rules` - _optional_ - array - The rules you want to use to drive your dynamic configuration.

## Flipr Rules

Flipr uses rules along with input provided at the time of config retrieval to calculate a single config value from many, i.e. dynamic configuration. Rules are just objects with three properties.

* **type** - `string` - The type of the rule. One of the following values.
    * [equal](#equal)
    * [list](#list)
    * [percent](#percent)
    * [includes](#includes)
    * [includesListAny](#includesListAny)
    * [includesListAll](#includesListAll)
* **input** - `string`, `function` - The input that is provided to the `getValue` and `getConfig` methods is typically something like a user or request context. The `input` property in the rule is the logic to extract data from the provided input that will be used to compare to the values in the config. A string is the [object-path](https://github.com/mariocasciaro/object-path#usage) of the value to use in the rule. A function accepts the input and returns the value to use in the rule. If you decide to use a function for a rule's input property, be aware that that function should be as safe as possible.  If an exception is thrown by the input function, that rule will be silently skipped.
* **property** - `string` - The name of the rule property used in the configuration. 

### Percent

The percent rule is used to change config values based on some percentage calculated using a unique identifier.  One common use for this rule is rolling out changes to an arbitrary percentage of users.  The example below shows how you would enable a feature for 15% of your users. Percents are cumulative, starting with the smallest percent and must add up to 100 for a single property, e.g. `1, 4, 95` would in reality be `0-1%, >1-5%, >5%-100%`.

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

The list rule allows you to change config values based on some list of allowed values.  One common use for this rule would be enabling features for specific users or groups of users.  The example below shows you how you could enable a feature for any users living in Arizona or California.

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
  input: 'user.state', // input can be a nested property
  property: 'states'
};
```

### Equal

The equal rule is much like the list rule, except it only allows a single value instead of a list of values.  One common use for this rule would be enabling features based on a single user characteristic that only has a limited number of states (e.g. boolean).  The example below shows you how you could enable a feature for any user that has been using your application for a number years, and is over the age of 18.  This example also shows another feature of rules: the ability to accept a function in the input property.  Note that all three rules let you pass a function for input.

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

### Includes

The includes rule has three distinct behaviors, depending on whether the input is a string, an array, or an object. It uses [lodash's `includes` ](https://lodash.com/docs/4.17.11#includes) method internally.

##### Input is a String

When input is a string, the includes rule will check if the rule property in the config is a substring of the input.

```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      name: john
    - value: false
```

```javascript
const rule = {
  type: 'includes',
  input: input => input,
  property: 'name',
};
...
flipr.getValue('isSomeFeatureEnabled', 'john'); // true
flipr.getValue('isSomeFeatureEnabled', 'johnathan'); // true
```

##### Input is an Array

When input is an array, the includes rule will check if the rule property in the config exists in the input array.

```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      groups: admins
    - value: false
```

```javascript
const rule = {
  type: 'includes',
  input: input => input,
  property: 'groups',
};
...
flipr.getValue('isSomeFeatureEnabled', ['users', 'admins']); // true
```

##### Input is an Object

When input is an object, the includes rule will check if the rule property in the config exists as a value in the input object. Note that the includes check is shallow, so only the input's root property values will be compared.

```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      groups: admins
    - value: false
```

```javascript
const rule = {
  type: 'includes',
  input: input => input,
  property: 'groups',
};
...
flipr.getValue('isSomeFeatureEnabled', { groupA: 'users', groupB: 'admins' }); // true
```

### IncludesListAll

The includesListAll rule is like the includes rule, in that it has the same three distinct behaviors, depending on whether the input is a string, an array, or an object. However, unlike the includes rules, the rule property in the config must always be an array. And **ALL** values in that array must match the includes logic.

```yaml
isSomeFeatureEnabled:
  values:
    - value: true
      groups:
        - admins
        - superAdmins
    - value: false
```

### IncludesListAny

The includesListAny rule is like the includesListAll rule, except at least one value in the rule property array must match the includes logic.

## Other Noteworthy Behavior

* Flipr deals with two different types of configuration data: static and dynamic.  Static configuration is created using the `value:` property, while dynamic is created using the `values:` property.  Static configuration doesn't change based on input, so the rules you define are ignored.  Dynamic configuration does change based on input.  Each time you pass input to flipr, it will run through the rules you have defined to determine the correct values.  While this is not an expensive operation, it would be a good idea to minimize the number of calls to flipr when getting dynamic configuration, especially if you have a large config.
* If you define `value` and `values` on the same item, `value` will always be chosen. Config validation will throw an error for this situation.
* Values from input are compared to values in config by making them both strings and using a case-insensitive comparison.
  * You can force case sensitivity by setting the 'isCaseSensitive' property on the rule to true.
* Rules are executed in the order they are defined in the rules option.  If a match is found for a rule, it will skip the remaining rules and return the matched value.
* Generally, flipr sources should be caching any data they retrieve to build the config.  Once it's cached, you'll need to explicitly call flush on flipr to get any updated values (unless the source implements some sort of automatic flushing).
* Accessing config via flipr is treated as an asynchronous action for the sake of compatibility, even if the source's implementation is synchronous.
