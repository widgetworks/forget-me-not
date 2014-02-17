
module.exports = function(result){
	// We might receive an array of results.
	var resultList = result;
	if (!(result instanceof Array)){
		resultList = [result];
	}
	
	var isValid = true;
	resultList.forEach(function(result){
		if (result.error){
			console.log('Error: ' + result.error);
			return;
		}
		
		console.log('Scanned: ' + result.dirsScanned + ' directories in "'+result.dir+'".');
		if (result.linkedDirs.length){
			// trace out the number of linked dirs.
			console.log('Found: ' + result.linkedDirs.length + ' symlinked directories.');
			console.log(result.linkedDirs);
			
			isValid = false;
		} else {
			// Success state, no linked directories.
			console.log('Found: 0 symlinked directories.');
		}
	});
	
	return isValid;
};