var path = require('path');
var fs = require('fs');
var q = require('q');

// Two general options:
//  1. Scan a directory.
//  2. Check npm/bower dependencies.

function scanDir(dir){
	var result = {
		dir: dir,
		dirsScanned: 0,
		linkedDirs: [],
		error: null
	};
	
	// TODO: Check for directory existence.
	if (fs.existsSync(dir)){
		var files = fs.readdirSync(dir);
		files.forEach(function(file){
			var newPath = path.join(dir, file);
			var stats = fs.lstatSync(newPath);
			// Check for symlink/junction.
			// if (stats.isDirectory() && stats.isSymbolicLink()){
			if (stats.isSymbolicLink()){
				result.linkedDirs.push(file);
			}
		});
		result.dirsScanned = files.length;
	} else {
		result.error = 'Directory does not exist: "'+dir+'"';
	}
	
	return result;
}

module.exports = function(paths, options){
	if (!(paths instanceof Array)){
		paths = [paths];
	}
	
	// Open the path and scan for dependencies.
	var resultList = paths.map(function(path){
		return scanDir(path);
	});
	
	return resultList;
};