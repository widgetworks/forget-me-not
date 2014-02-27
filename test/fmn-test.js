var fs = require('fs');
var os = require('os');
var path = require('path');
var expect = require('expect.js');
var ncp = require('ncp');
var rimraf = require('rimraf');

var fmn = require('../lib/fmn');
var fmnTask = require('../tasks/lib/task');

var testLinks = {
	// src: dest
	'invalid/original': 'invalid/link',
	'bower-invalid/bower_components/original': 'bower-invalid/bower_components/link',
	'bower-rc-invalid/build/vendor/assets/original': 'bower-rc-invalid/build/vendor/assets/link',
	'npm-invalid/node_modules/original': 'npm-invalid/node_modules/link',
	
	'multi-invalid/other/invalid/original': 'multi-invalid/other/invalid/link',
	'multi-invalid/node_modules/original': 'multi-invalid/node_modules/link',
	'multi-invalid/bower_components/original': 'multi-invalid/bower_components/link'
};


/*
Scenarios:
 - valid dir
 - invalid dir
 - default bower dir (valid, invalid)
 - custom bower dir (valid, invalid)
 - npm dir (valid, invalid)
*/

function initTestDirs(done){
	ncp('./test/fixtures/', './tmp/', {clobber: false}, function(err){
		if (err){
			// error
			done(err);
		} else {
			
			var isWindows = os.platform() == 'win32';
			var linkType = isWindows ? 'junction' : 'dir';
			
			// Link all the paths.
			for (var i in testLinks){
				var src = path.join('tmp', i);
				var dest = path.join('tmp', testLinks[i]);
				if (!fs.existsSync(dest)){
					fs.symlinkSync(src, dest, linkType);
				} else {
					console.log('Skipping "'+dest+'", already exists.');
				}
			}
			
			done();
		}
	});
}

function cleanTestDirs(done){
	rimraf('tmp', done);
}

describe('forget-me-not', function(){
	before(function(done){
		initTestDirs(done);
	});
	
	after(function(done){
		cleanTestDirs(done);
	});
	
	describe('grunt task:', function(){
		
		describe('directory list', function(){
			it('detects valid directories', function(){
				var reportResult = fmnTask({
					dirs: [
						'tmp/valid'
					],
					npm: false,
					bower: false
				});
				
				expect(reportResult.isValid).to.equal(true);
				expect(reportResult.messageList.length).to.eql(1);
			});
			
			it('detects invalid directories', function(){
				var reportResult = fmnTask({
					dirs: [
						'tmp/invalid'
					],
					npm: false,
					bower: false
				});
				
				expect(reportResult.isValid).to.equal(false);
				expect(reportResult.messageList.length).to.eql(1);
			});
			
			it('scans multiple directories', function(){
				var reportResult = fmnTask({
					dirs: [
						'tmp/valid',
						'tmp/invalid'
					],
					npm: false,
					bower: false
				});
				
				expect(reportResult.isValid).to.equal(false);
				expect(reportResult.messageList.length).to.eql(2);
			});
			
			it('fails on non-existent directories', function(){
				var reportResult = fmnTask({
					dirs: [
						'tmp/does-not-exist'
					],
					npm: false,
					bower: false
				});
				
				expect(reportResult.isValid).to.equal(false);
				expect(reportResult.messageList.length).to.eql(1);
			});
			
			describe('multiple directories', function(){
				var cwd;
				
				before(function(){
					cwd = process.cwd();
				});
				
				after(function(){
					process.chdir(cwd);
				});
				
				it('valid', function(){
					process.chdir(path.join(__dirname, '../tmp/multi-valid'));
					
					var reportResult = fmnTask({
						dirs: [
							'other/valid'
						],
						npm: true,
						bower: true
					});
					
					expect(reportResult.messageList.length).to.eql(3);
					expect(reportResult.isValid).to.equal(true);
				});
				
				
				it('invalid', function(){
					process.chdir(path.join(__dirname, '../tmp/multi-invalid'));
					
					var reportResult = fmnTask({
						dirs: [
							'other/invalid'
						],
						npm: true,
						bower: true
					});
					
					expect(reportResult.isValid).to.equal(false);
					expect(reportResult.messageList.length).to.eql(3);
				});
				
				it('ignores bower and npm directories if they don\'t exist' , function(){
					process.chdir(path.join(__dirname, '../tmp/valid'));
					
					var reportResult = fmnTask({
						npm: true,
						bower: true
					});
					
					expect(reportResult.isValid).to.equal(true);
					expect(reportResult.messageList.length).to.eql(0);
				});
			});
		});
		
		describe('bower', function(){
			describe('bower-standard', function(){
				var cwd;
				
				before(function(){
					cwd = process.cwd();
				});
				
				after(function(){
					process.chdir(cwd);
				});
				
				it('detects valid directories', function(){
					process.chdir(path.join(__dirname, '../tmp/bower-valid'));
					
					var reportResult = fmnTask({
						npm: false,
						bower: true
					});
					
					expect(reportResult.isValid).to.equal(true);
					expect(reportResult.messageList.length).to.eql(1);
				});
				
				it('detects invalid directories', function(){
					process.chdir(path.join(__dirname, '../tmp/bower-invalid'));
					
					var reportResult = fmnTask({
						npm: false,
						bower: true
					});
					
					expect(reportResult.isValid).to.equal(false);
					expect(reportResult.messageList.length).to.eql(1);
				});
			});

			describe('bower-custom', function(){
				var cwd;
				
				before(function(){
					cwd = process.cwd();
				});
				
				after(function(){
					process.chdir(cwd);
				});
				
				it('detects valid directories', function(){
					process.chdir(path.join(__dirname, '../tmp/bower-rc-valid'));
					
					var reportResult = fmnTask({
						npm: false,
						bower: true
					});
					
					expect(reportResult.isValid).to.equal(true);
					expect(reportResult.messageList.length).to.eql(1);
				});
				
				it('detects invalid directories', function(){
					process.chdir(path.join(__dirname, '../tmp/bower-rc-invalid'));
					
					var reportResult = fmnTask({
						npm: false,
						bower: true
					});
					
					expect(reportResult.isValid).to.equal(false);
					expect(reportResult.messageList.length).to.eql(1);
				});
			});
		});

		describe('npm', function(){
			var cwd;
			
			before(function(){
				cwd = process.cwd();
			});
			
			after(function(){
				process.chdir(cwd);
			});
			
			it('detects valid directories', function(){
				process.chdir(path.join(__dirname, '../tmp/npm-valid'));
				
				var reportResult = fmnTask({
					npm: true,
					bower: false
				});
				
				expect(reportResult.isValid).to.equal(true);
				expect(reportResult.messageList.length).to.eql(1);
			});
			
			it('detects invalid directories', function(){
				process.chdir(path.join(__dirname, '../tmp/npm-invalid'));
				
				var reportResult = fmnTask({
					npm: true,
					bower: false
				});
				
				expect(reportResult.isValid).to.equal(false);
				expect(reportResult.messageList.length).to.eql(1);
			});
		});
	});
	
	// TODO: Test individual library modules.
});
