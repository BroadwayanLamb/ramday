var http = require("http");
var fio = require("fs");
var qs = require("querystring");

http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' } );

	req.method = req.method.toUpperCase();
	
	if (req.method == "GET") {
		fio.readFile("index.html", function(err, data) {
			res.write(data);
			res.end();
		});
	} else if (req.method == "POST") {
		
		var body = "";
		
		req.on("data", chunk => {
			body += chunk.toString();
		});
		
		req.on("end", function() {
			var form = qs.parse(body);
			fio.readFile("success.html", function(err, data) {
				res.write(data);
				res.end();
			});
			fio.appendFileSync("members.list", JSON.stringify(form) + "\n");
		});
		
	}
	
}).listen(80);