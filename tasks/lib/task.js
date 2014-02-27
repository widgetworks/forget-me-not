var fs = require('fs');

var fmn = require('../../lib/fmn.js');
var report = require('../../lib/report.js');
var bowerConfig = require('bower-config');

module.exports = function(options){
	var dirs = [];
	if (options.dirs){
		dirs = dirs.concat(options.dirs)
	}
	
	// Only add bower and npm directories if they exist.
	var npmDir = 'node_modules';
	if (options.npm && fs.existsSync(npmDir)){
		dirs.push(npmDir);
	}
	
	if (options.bower){
		// Look up the configured bower directory.
		var bower = bowerConfig.read();
		if (bower && fs.existsSync(bower.directory)){
			dirs.push(bower.directory);
		}
	}
	
	// Scan each of the directories - aggregate the output.
	var resultList = fmn(dirs);
	var reportResult = report(resultList);
	
	return reportResult;
};