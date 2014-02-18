var bowerConfig = require('bower-config');

var fmn = require('../lib/fmn.js');
var report = require('../lib/report.js');

module.exports = function(grunt){
	
	grunt.registerMultiTask('forget-me-not', 'Scans dependency directories for symlinked (i.e. development) directories before release.', function(){
		var options = this.options({
			// TODO: Can accept a list of directories.
			// Or npm: true, bower: true - check 
			
			dirs: [],
			npm: true,
			bower: true,
			
			// If false then we will fail the task, otherwise we will just warn.
			warnOnly: false
		});
		options.warnOnly = grunt.option('warn') || options.warnOnly;
		
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
		var reportResult = report(resultList);
		
		if (reportResult.isValid){
			grunt.log.oklns('No development links found.');
		} else {
			reportResult.messageList.forEach(function(item){
				if (item.isValid){
					grunt.log.writeln(item.message);
				} else {
					grunt.log.errorlns(item.message);
				}
			});
			
			// Warn or fail because there are linked directories.
			var message = 'Found linked dependencies or error.';
			if (options.warnOnly){
				grunt.fail.warn(message);
			} else {
				grunt.fail.fatal(message);
			}
		}
	});
	
	
};