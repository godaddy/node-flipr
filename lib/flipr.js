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

  _getValue(config, key, input) {
    // value (static) always overrides values (dynamic) on config item
    if (Object.prototype.hasOwnProperty.call(config[key], 'value')) {
      return config[key].value;
    }
    return getValueByRules(input, this.options.rules, config[key].values);
  }

  static idToPercent(id) {
    return idToPercent(id);
  }

  static validateRules(rules) {
    rules.map(validateRule);
  }

  async preload() {
    await this.source.preload();
  }

  async flush() {
    await this.source.flush();
  }

  async getValue(key, input) {
    const config = await this.source.getConfig();
    return this._getValue(config, key, input);
  }

  async getConfig(input) {
    const config = await this.source.getConfig();
    const keys = Object.keys(config);
    return keys.reduce((memo, key) => ({
      ...memo,
      [key]: this._getValue(config, key, input),
    }), {});
  }

  async validateConfig() {
    return this.source.validateConfig(this.options.rules);
  }
}

module.exports = Flipr;
