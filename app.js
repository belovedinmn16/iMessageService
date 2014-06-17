// PUT YOUR IMESSAGE PHONE NUMBER HERE:
var myPhoneNumber = "+";

var express = require('express');
var applescript = require('applescript');
var app = express();
var fs = require('fs');
var xml2js = require('xml2js');
app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(__dirname + '/public'));

app.get('/getMessages', function (req, res) {
	console.log("getting messages");

	var parser = new xml2js.Parser();
	fs.readFile('/Users/' + process.env['LOGNAME'] + '/Desktop/textdata.xml', 'utf8', function(err, data) {
		data += "</messages>";
		console.log(data);
	    parser.parseString(data, function (err, result) {
	        console.dir(result);
	        console.log(err);
	        //res.write("test");
	        res.write(JSON.stringify(result));
			res.end("");
	    });
	});
});

app.post('/sendMessage', function (req, res) {
	console.log(req.body);
	var cmds = [];
	cmds.push(req.body.sendTo);
	cmds.push(req.body.sendText);
	console.log(cmds);
	applescript.execFile('./sendText.applescript', cmds, function (err, ret) {
		if (!err) {
			res.write("{\"success\":true}");
			fs.appendFile('/Users/' + process.env['LOGNAME'] + '/Desktop/textdata.xml', '\n<message><name>' + req.body.sendToName + '</name><id>' + myPhoneNumber + '</id><text>' + req.body.sendText + '</text></message>', function (err) {

			});
		} else {
			console.log(err);
		}
		res.end("");
	});
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});