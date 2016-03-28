var path = require('path');
var fs = require('fs');
var util = require('util');

// Two general options:
//  1. Scan a directory.
//  2. Check npm/bower dependencies.

function scanDir(dir){
	var result = {
		dir: dir,
		dirsScanned: 0,
		linkedDirs: [],
		message: null,
		isValid: true
	};
	
	// Check for directory existence.
	if (fs.existsSync(dir)){
		var files = fs.readdirSync(dir);
		files.forEach(function(file){
			var newPath = path.join(dir, file);
			var stats = fs.lstatSync(newPath);
			// Check for symlink/junction.
			if (stats.isSymbolicLink()){
				result.linkedDirs.push(file);
				result.isValid = false;
			}
		});
		result.dirsScanned = files.length;
	} else {
		result.message = 'Directory does not exist: "'+dir+'"';
		result.isValid = false;
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


/**
 * Return the list of directories to search for
 * symlinks. Defaults to 'bower' and 'node_modules'
 * (but adds scoped npm directories too)
 * 
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
module.exports.collectDirs = function(options){
	var fs = require('fs');
	var bowerConfig = require('bower-config');
	var glob = require('glob');
	
	var dirs = [];
	
	// Only add bower and npm directories if they exist.
	var npmDir = 'node_modules';
	if (options.npm && fs.existsSync(npmDir)){
		dirs.push(npmDir);
		
		// Find any scoped npm modules (starting with '@')
		var scopedModules = glob.sync(`${npmDir}/@*`, {
			noext: true
		});
		dirs = dirs.concat(scopedModules);
	}
	
	if (options.bower){
		// Look up the configured bower directory.
		var bower = bowerConfig.read();
		if (bower && fs.existsSync(bower.directory)){
			dirs.push(bower.directory);
		}
	}
	
	return dirs;
};