function mockSource(values) {
  return {
    async getConfig() {
      return {
        someKey: {
          values,
        }
      }
    }
  }
}

module.exports = mockSource;
