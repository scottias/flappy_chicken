var express = require('express'),
	http = require('http'),
	path = require('path'),
	scores = require('./public/routes/scores'),
	app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/scripts'));

//------------------------------------------------------------------
//
// Define the different routes we support
//
//------------------------------------------------------------------
app.get('/', function(request, response) {
	response.render('index.html');
});

app.get('/v1/scores', scores.all);
app.post('/v1/scores', scores.add);

app.get('/v1/scores/clear', scores.clear);

app.all('/v1/*', function(request, response) {
	response.writeHead(501);
	response.end();
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
