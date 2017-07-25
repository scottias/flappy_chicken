
var scores = [];

exports.all = function(request, response) {
	console.log('find all scores called');
	response.writeHead(200, {'content-type': 'application/json'});
	response.end(JSON.stringify(scores));
};

exports.add = function(request, response) {
	console.log('add new score called');
	console.log('Name: ' + request.query.name);
	console.log('Score: ' + request.query.score);

	var now = new Date();
	scores.push( {
		name : request.query.name,
		date : now.toLocaleDateString(),
		score : request.query.score
	});

	var keysSorted = Object.keys(scores).sort(function(a,b){return scores[b].score-scores[a].score});
	keysSorted.splice(10);
	var sortedScores = [];
	for(var i = 0; i < keysSorted.length; i++){
		console.log(keysSorted[i]);
		sortedScores.push(scores[keysSorted[i]]);
	}
	scores = sortedScores;

	response.writeHead(200);
	response.end();
};

exports.clear = function(request, response) {
	console.log('clear all scores');
	scores = [];

	response.writeHead(200);
	response.end();	
};

