
var express = require("express");
var request = require("request");

var app = express();

app.disable('x-powered-by');
app.engine('jshtml', require('jshtml-express'));

app.use("/static", express.static(__dirname + '/public/'));
app.use(express.logger());

app.get("/rr/:lat/:lon", function(req, res) {

	// TODO: Cache this for 5 mins.

	request("http://gps.buienradar.nl/getrr.php?lat=" + req.params.lat + "&lon=" + req.params.lon, function(err, response, body) { 
		var result = [];
		var lines = body.split("\n");
		lines.forEach(function(e, i){
			var fields = e.trim().split("|");
			if( fields.length == 2 ) {
				result.push({value: parseInt(fields[0]),time:fields[1]});
			}
		});
		res.send(result);
	});
});

app.get("/", function(req, res) {
	res.set("X-UA-Compatible", "chrome=1");
	res.render( "index.jshtml" );
});

app.listen( process.env.PORT || 3000, function(err) {
	console.info( "server started on port " + (process.env.PORT || 3000) );
});
