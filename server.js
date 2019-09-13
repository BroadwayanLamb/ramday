var http = require("http");
var fio = require("fs");
var qs = require("querystring");

const data = ["firstName", "lastName", "grade", "snum", "email"];

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
			
			let str = "";
			let first = true;
			
			if (!fio.existsSync("members.list")){
				for (index in data){
					str += (!first? "," : "") + data[index];
					first = false;
				}
				fio.appendFileSync("members.list", str + "\n");
			}
			
			str = "";
			first = true;
			
			for (index in data){
				try{
					str += (!first? ",\"" : "\"") + form[data[index]].replace("\"", "\"\"") + "\"";
					first = false;
				} catch(e) {
					return;
				}
			}
			
			fio.appendFileSync("members.list", str + "\n");
		});
		
	}
	
}).listen(80);