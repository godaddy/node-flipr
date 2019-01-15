module.exports = {
  async getConfig() {
    return {
      testKey: {
        description: 'Some test description',
        values: [
          {
            value: 1
          },
          {
            value: 2,
            isUserSpecial: true
          }
        ]
      }
    };
  }
};