var path = require('path');
var fs = require('fs');
var q = require('q');

// Two general options:
//  1. Scan a directory.
//  2. Check npm/bower dependencies.

function scanDir(dir){
	var deferred = q.defer();
	
	var results = {
		dirsScanned: 0,
		linkedDirs: []
	};
	fs.readdir(dir, function(err, files){
		if (err){
			// do something with the error.
			deferred.reject(err);
			return;
		}
		
		var i = 0;
		var fileCount = files.length;
		
		files.forEach(function(file){
			var newPath = path.join(dir, file);
			fs.lstat(newPath, function(err, stats){
				if (err){
					// throw error
					deferred.reject(err);
					return;
				}
				
				// Check for symlink/junction.
				// if (stats.isDirectory() && stats.isSymbolicLink()){
				if (stats.isSymbolicLink()){
					results.linkedDirs.push(file);
				}
				
				i++;
				if (i == fileCount){
					results.dirsScanned = fileCount;
					deferred.resolve(results);
				}
			});
		});
	});
	
	return deferred.promise;
}

function scanBower(){
	
}

function scanNpm(){
	
}

module.exports = function(path, options){
	
	// Open the path and scan for dependencies.
	scanDir(path).then(function(result){
		console.log('Scanned: ' + result.dirsScanned + ' directories in "'+path+'".');
		if (result.linkedDirs.length){
			// trace out the number of linked dirs.
			console.log('Found: ' + result.linkedDirs.length + ' symlinked directories.');
			console.log(result.linkedDirs);
		} else {
			// Success state, no linked directories.
			console.log('Found: 0 symlinked directories.');
		}
	}, function(err){
		// error state.
		
	});
	
};