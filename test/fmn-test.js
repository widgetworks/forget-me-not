var path = require('path');
var fs = require('fs');
var expect = require('expect.js');
var fstream = require('fstream');
var rimraf = require('rimraf');

var fmn = require('./lib/fmn');

describe('forget-me-not', function(){
	
	beforeEach(function(done){
		
		
		done();
	});
	
	afterEach(function(done){
		// TODO: Clean up.
		
		done();
	});
	
	
	fmn('test/fixtures');
});