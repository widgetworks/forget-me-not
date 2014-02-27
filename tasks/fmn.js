var task = require('./lib/task.js');

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
		
		// Scan each of the directories - aggregate the output.
		var reportResult = task(options);
		
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