var fmn = require('./lib/fmn');
var report = require('./lib/report');

var resultList = fmn('test/fixtures');
var reportResult = report(resultList);
reportResult.messageList.forEach(function(item){
	console.log(item.message);
});