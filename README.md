node-flipr
============

Feature flipping and configuration using yaml files.

![node-flipr](/flipr.png?raw=true "node-flipr")

## How does it work?
###Here's the simplest example:
```yaml
---
# Here's a basic YAML config file. Assume it exists at config/simple.yaml
someConfigKey:
  description: >
    This is some config key that has some value.
  value: someValue
```

```javascript
var flipr = require('flipr');
flipr.init({
  folderPath: 'config/',
  fileName: 'simple.yaml'
});
flipr(function(err, config){
  console.dir(config);
});
```
###Here's a more complex example:
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
var flipr = require('flipr');
flipr.init({
  folderPath: 'config/',
  fileName: 'complex.yaml',
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

## Would you like to know [more](http://i.imgur.com/IOvYPfT.jpg)?
* [Basic example](/sample/basic.js)
* [Feature flipping](/sample/feature-flipping.js)
* [Using default values if rule match isn't found](/sample/default.js)
* [Environment-aware configuration files](/sample/environment-awareness.js)
* [Integrating with express/connect via middleware](/sample/connect-middleware.js)
* [Validating input to flipr](/sample/validate-input.js)
* [Validating config files](/sample/validate-config.js)
* [Forcing a preload/cache of YAML file](/sample/preload.js)
* [Get a single static value](/sample/get-value.js)
* [Get a single dynamic value](/sample/get-value-by-rules.js)
* [Flushing cached config](/sample/flush-cache.js)

## Flipr Options
* `folderPath` (string): The folder path containing the configuration files.  It should be a *relative* path to the CWD of your application process (`process.cwd()`).  In most cases, this would be the root of your repo.
  * Defaults to `'lib/config/'`
* `fileName` (string): The name of the file in `folderPath` to use for configuration.  If specified, it will override all environment-based options.
* `envVariable` (string): The name of the environment variable that stores a string identifying the host's environment.
  * Defaults to `'NODE_ENV'`
* `envFileNameMap` (object): A key/value object used to map values from `envVariable` to `envFileNameFormat` placeholders.  See [this sample](/sample/environment-awareness.js) for more details.
  * Default

```javascript
{
  dev: 'dev',
  development: 'development',
  test: 'test',
  staging: 'staging',
  master: 'prod',
  prod: 'prod',
  prodution: 'production'
}
```
* `envFileNameFormat` (string): The util.format string for your environment-based configuration files.  It should contain a single format placeholder (`%s`), which will be replaced by the value selected from `envFileNameMap`.
  * Defaults to `'%s.yaml'`
* `envLocalFileName` (string): Name of the file that is used to conditionally override the environment-based config file.  If this file exists, flipr will use it instead of the one for the current environment.  Useful for overriding configuration locally.  Typically you would add this file to your .gitignore.
  * Defaults to `'local.yaml'`
* `inputValidator` (function(input, cb)): Flipr uses inputValidator to test the validity of the input it receives before it tries to use that input to retrieve config based on the rules you've defined.  If you're using the connect middleware, the inputValidator decides whether to retrieve the dyanmic or static configuration, based on the validity of the input.  If you're calling flipr.getDictionaryByRules explicity, then an error will be returned in the case of invalid input.  Check out [this example](/sample/validate-input.js);

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

###Input as a function
The Equal rule example located above shows you that you can define a funtion to transform the input sent to flipr to create some complex rules.  If you decide to use functions for a rule's input, be aware that that function should be as safe as possible.  If an exception is thrown by the input function, that rule will be silently skipped.  You can use flipr's [input validation functionality](/sample/validate-input.js) to help catch edge cases that would cause any exceptions in your input functions.

##Other Noteworthy Behavior
* Flipr deals with two different types of configuration data: static and dynamic.  Static configuration is created using the `value:` property in your YAML files, while dyanmic is created using the `values:` property.  Static configuration doesn't change based on input, so the rules you define are ignored, and it is cached after the first read.  Dynamic configuration does change based on input and is not cached.  Each time you pass input to flipr, it will run through the rules you have defined to determine the correct values.  While this is not an expensive operation, it would be a good idea to limit the number of calls to flipr when getting dynamic configuration, especially if you have a large YAML file.
* Values from input are compared to values in config by making them both strings and using a case-insensitive comparison.
  * You can force case sensitivity by setting the 'isCaseSensitive' property on the rule to true.
* Flipr has the ability to validate your config, based on the rules you've defined.  You should do this in your unit tests, to ensure that bad config changes don't make it past the test phase of your build.
* Rules are executed in the order they are defined in the rules option.  If a match is found for a rule, it will skip the remaining rules and return the matched value.
* The YAML file is cached after it has been read once.  If you edit the YAML file after it ha been cached, flipr will not see the changes until you explicitly call flipr.flush().
* Accessing config via flipr is an asynchornous action.
