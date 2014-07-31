'use strict';

module.exports = continueIfValid;

function continueIfValid(isValid, cb) {
  if(isValid === true)
    cb();
  else
    cb(new Error('Invalid input detected, cannot continue.'));
}