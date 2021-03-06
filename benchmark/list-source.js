module.exports = {
  async getConfig() {
    return {
      testKey: {
        description: 'Some test description',
        values: [
          {
            value: 1,
            userIds: [
              1111,
              2222,
              3333,
              4444,
              5555
            ]
          },
          {
            value: 2,
            userIds: [
              11111,
              22222,
              33333,
              44444,
              55555
            ]
          },
          {
            value: 3,
            userIds: [
              111111,
              222222,
              333333,
              444444,
              555555
            ]
          },
          {
            value: 4,
            userIds: [
              1111111,
              2222222,
              3333333,
              4444444,
              5555555
            ]
          }
        ]
      }
    };
  }
};
