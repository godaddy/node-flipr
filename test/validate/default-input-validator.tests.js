'use strict';

var chai = require('chai');
var expect = chai.expect;
var sutPath = '../../lib/validate/default-input-validator';
var sut = require(sutPath);

describe('default-input-validator', function(){
	it('does not perform validation and result is always true and error is always null', function(){
		sut('test', function(err, result){
			expect(err).to.be.null;
			expect(result).to.equal(true);
		});
	});
});
