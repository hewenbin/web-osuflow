// connect http server
var fs = require('fs');
var connect = require('connect');

var log = fs.createWriteStream(__dirname + "/log/wof-http.log", {flags : "a"});

var wof = connect()
	.use(connect.favicon())
	.use(connect.logger({format : "short", stream : log}))
	.use(connect.static("public"))
	.listen(80);

var nofServer = require("./lib/nof");
nofServer.listen(wof);
