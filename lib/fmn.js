var path = require('path');
var fs = require('fs');
var q = require('q');

// Two general options:
//  1. Scan a directory.
//  2. Check npm/bower dependencies.

function scanDir(dir){
	var files = fs.readdirSync(dir);
	var results = {
		dir: dir,
		dirsScanned: files.length,
		linkedDirs: []
	};
	
	files.forEach(function(file){
		var newPath = path.join(dir, file);
		var stats = fs.lstatSync(newPath);
		// Check for symlink/junction.
		// if (stats.isDirectory() && stats.isSymbolicLink()){
		if (stats.isSymbolicLink()){
			results.linkedDirs.push(file);
		}
	});
		
	return results;
}

module.exports = function(paths, options){
	if (!(paths instanceof Array)){
		paths = [paths];
	}
	
	// Open the path and scan for dependencies.
	var resultList = paths.map(function(){
		return scanDir(path);
	});
	
	return resultList;
};