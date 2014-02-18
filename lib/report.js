
// TODO: Consolidate the report??
module.exports = function(result){
	// We might receive an array of results.
	var resultList = result;
	if (!(result instanceof Array)){
		resultList = [result];
	}
	
	var messageList = [];
	var isValid = true;
	resultList.forEach(function(result){
		var message = 'Scanned "'+result.dir+'": ' + result.dirsScanned + ' children ('+result.linkedDirs.length+' symlinked)';
		if (result.linkedDirs.length){
			message += '\nInvalid dirs: [\n\t' + result.linkedDirs.join(',\n\t') + '\n]';
		}
		
		if (!result.isValid) {
			isValid = false;
			if (result.message){
				message = 'Error: ' + result.message;
			}
		}
		
		messageList.push({
			dir: result.dir,
			message: message,
			linkedDirs: result.linkedDirs
		});
	});
	
	return {
		isValid: isValid,
		messageList: messageList
	}
};