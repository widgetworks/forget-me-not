var bowerConfig = require('bower-config');

var fmn = require('../lib/fmn.js');
var report = require('../lib/fmn.js');

module.exports = function(grunt){
	
	grunt.registerMultiTask('forget-me-not', 'Scans dependency directories for symlinked (i.e. development) directories before release.', function(){
		var options = this.options({
			// TODO: Can accept a list of directories.
			// Or npm: true, bower: true - check 
			
			dirs: [],
			npm: true,
			bower: true,
			
			// If true then we will fail the task, otherwise we will just warn.
			failOnLinks: true
		});
		
		var dirs = [];
		if (options.dirs){
			dirs = dirs.concat(options.dirs)
		}
		
		if (options.npm){
			dirs.push('node_modules');
		}
		
		if (options.bower){
			// Look up the configured bower directory.
			var bower = bowerConfig.read();
			if (bower){
				dirs.push(bower.directory);
			}
		}
		
		// Scan each of the directories - aggregate the output.
		var resultList = fmn(dirs);
		if (!report(resultList)){
			// TODO: Check the return value??
			// Warn or fail because there are linked directories.
			var message = 'Found linked dependencies.';
			if (options.failOnLinks){
				grunt.fail.fatal(message);
			} else {
				grunt.fail.warn(message);
			}
		}
		
	});
	
	
};