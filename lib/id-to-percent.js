const crypto = require('crypto');

function idToPercent(id) {
  return crypto
    .createHash('md5')
    .update(String(id), 'utf-8')
    .digest()
    .readUInt32LE(4) / 4294967295;
}

module.exports = idToPercent;
