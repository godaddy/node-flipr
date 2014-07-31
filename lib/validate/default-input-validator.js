'use strict';

module.exports = defaultInputValidator;

//Does no validation. Overriden in options.inputValidator.
function defaultInputValidator(input, cb) {
  cb(null, true);
}