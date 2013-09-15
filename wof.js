// connect http server
var fs = require('fs');
var connect = require('connect');

var log = fs.createWriteStream(__dirname + "/log/wof-http.log", {flags : "a"});

var app = connect()
	.use(connect.favicon())
	.use(connect.logger({format : "short", stream : log}))
	.use(connect.directory("public"))
	.use(connect.static("public"))
	.listen(80);
