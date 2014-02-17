var fmn = require('./lib/fmn');
var report = require('./lib/report');

var resultList = fmn('test/fixtures');
report(resultList);