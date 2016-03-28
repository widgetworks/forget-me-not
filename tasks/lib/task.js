var fmn = require('../../lib/fmn.js');
var report = require('../../lib/report.js');

module.exports = function(options){
	var dirs = options.dirs || [];
	var fmnDirs = fmn.collectDirs(options)
	dirs = dirs.concat(fmnDirs);
	
	// Scan each of the directories - aggregate the output.
	var resultList = fmn(dirs);
	var reportResult = report(resultList);
	
	return reportResult;
};