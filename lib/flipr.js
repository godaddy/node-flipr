const isFunction = require('lodash.isfunction');
const validateRule = require('./rules/validate-rule');
const getValueByRules = require('./rules/get-value-by-rules');
const idToPercent = require('./id-to-percent');

const defaultOptions = { rules: [] };

class Flipr {
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    if (!this.options.source) {
      throw new Error('options.source is required');
    }
    this.source = this.options.source;
    this.options.rules.map(validateRule);
  }

  static idToPercent(id) {
    return idToPercent(id);
  }

  static validateRules(rules) {
    rules.map(validateRule);
  }

  async preload() {
    if (isFunction(this.source.preload)) {
      await this.source.preload();
    }
  }

  async flush() {
    if (isFunction(this.source.flush)) {
      await this.source.flush();
    }
  }

  async getValue(key) {
    const config = await this.source.getConfig();
    return config[key].value;
  }

  async getDynamicValue(input, key) {
    const config = await this.source.getConfig();
    return getValueByRules(input, this.options.rules, config[key].values);
  }

  async getConfig() {
    const config = await this.source.getConfig();
    const keys = Object.keys(config);
    return keys.reduce((memo, key) => {
      if (!Object.prototype.hasOwnProperty.call(config[key], 'value')) {
        return memo;
      }
      return {
        ...memo,
        [key]: config[key].value,
      };
    }, {});
  }

  async getDynamicConfig(input) {
    const config = await this.source.getConfig();
    const keys = Object.keys(config);
    return keys.reduce((memo, key) => {
      if (!Object.prototype.hasOwnProperty.call(config[key], 'values')) {
        return memo;
      }
      return {
        ...memo,
        [key]: getValueByRules(input, this.options.rules, config[key].values),
      };
    }, {});
  }
}

module.exports = Flipr;
