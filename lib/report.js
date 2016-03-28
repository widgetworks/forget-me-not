module.exports = function(result){
	var chalk = require('chalk');
	
	// We might receive an array of results.
	var resultList = result;
	if (!(result instanceof Array)){
		resultList = [result];
	}
	
	var messageList = [];
	var isValid = true;
	resultList.forEach(function(result){
		var colour = chalk.cyan;
		if (result.linkedDirs.length){
			colour = chalk.red;
		}
		
		var message = `Scanned "${colour.call(chalk, result.dir)}": ${result.dirsScanned} children (${result.linkedDirs.length} symlinks)`;
		if (result.linkedDirs.length){
			message += `\nSymlinks found: [\n\t${result.linkedDirs.join(',\n\t')}\n]`;
		}
		
		if (!result.isValid) {
			isValid = false;
			if (result.message){
				message = 'Error: ' + result.message;
			}
		}
		
		messageList.push({
			dir: result.dir,
			isValid: result.isValid,
			message: message,
			linkedDirs: result.linkedDirs
		});
	});
	
	return {
		isValid: isValid,
		messageList: messageList
	}
};