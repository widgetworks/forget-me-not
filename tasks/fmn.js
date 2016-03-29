var _ = require('lodash');

var fmnTask = require('./lib/task.js');

module.exports = function(grunt){
	
	grunt.registerTask('forget-me-not', 'Scan for symlinked development projects', function(target){
		var options = this.options({
			dirs: [],
			npm: true,
			bower: true,
			onError: 'warn'	// Valid values: 'warn', 'log'
		});
		
		// Merge in target options over the default options.
		if (target){
			var targetConfig = grunt.config.get('forget-me-not.'+target) || {};
			_.merge(
				options,
				targetConfig.options || {}
			);
		}
		
		if (grunt.option('fmn-log')) {
			options.onError = 'log';
		}
		
		// Scan each of the directories - aggregate the output.
		var reportResult = fmnTask(options);
		
		if (reportResult.isValid){
			grunt.log.oklns('Everything clean');
		} else {
			reportResult.messageList.forEach(function(item){
				if (item.isValid){
					grunt.log.writeln(item.message);
				} else {
					grunt.log.errorlns(item.message);
				}
			});
			
			// Log, warn or fail because there are linked directories.
			var message = 'Development dependencies found (or an error occurred)';
			switch (options.onError) {
				case 'log':
					grunt.log.errorlns(message);
					grunt.log.oklns('forget-me-not: Ignoring dependencies...');
					break;
				
				case 'warn':
				default:
					grunt.fail.warn(message);
					break;
			}
		}
	});
	
	
	grunt.registerTask('fmn', 'Alias for `forget-me-not`', function(){
		grunt.task.run([
			'forget-me-not'
		]);
	});
	
};