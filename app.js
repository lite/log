var local = require('./local.js');
var _ = require('underscore'); 
var WebClient = require('@slack/client').WebClient;

var express = require('express');
var bodyParser = require('body-parser');

var createHandler = require("github-webhook-handler");

var hellobot = require('./hellobot');

var app = express();
var port = process.env.PORT || 3000;
// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!') });

app.post('/hello', hellobot);

var handler = createHandler({path: '/', secret: local.github.api_secret});
app.post("/webhooks/github", function(req, res){
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location')
  });
});
handler.on("push", function(event){
	console.log(
		'Received a push event for %s to %s',
		event.payload.repository.name,
		event.payload.ref
	);
	// exec("/usr/bin/git pull");
	// exec("npm install");

	// https://api.slack.com/docs/oauth-test-tokens?team_id=T037CM3Q6&action=reissue&sudo=1
	var web = new WebClient(local.slack_api_token);
	web.chat.postMessage('#log', 'hello from @slack/client', function(err, res) {
	    if (err) {
	        console.log('Error:', err);
	    } else {
	        console.log('Message sent: ', res);
	    }
	});
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function() {
  console.log('Express listening on port', this.address().port);
});

// handler.on('push', function (event) {
//   console.log('Received a push event for %s to %s',
//     event.payload.repository.name,
//     event.payload.ref)

// 	// https://api.slack.com/docs/oauth-test-tokens?team_id=T037CM3Q6&action=reissue&sudo=1
// 	var web = new WebClient(local.slack_api_token);
// 	web.chat.postMessage('#log', 'hello from @slack/client', function(err, res) {
// 	    if (err) {
// 	        console.log('Error:', err);
// 	    } else {
// 	        console.log('Message sent: ', res);
// 	    }
// 	});
// })

// var GitHubApi = require("github");

// var github = new GitHubApi({
//     // optional
//     debug: true,
//     protocol: "https",
//     host: "api.github.com", // should be api.github.com for GitHub
//     pathPrefix: "", // for some GHEs; none for GitHub
//     headers: {
//         "user-agent": "dogfish api" // GitHub is happy with a unique user agent
//     },
//     Promise: require('bluebird'),
//     followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
//     timeout: 5000
// });

// github.authenticate({
//     type: "oauth",
//     token: local.github_api_token
// });

// github.gists.create({
// 	    "description": "slack bot gist.",
// 	    "public": false,
// 	    "files":
// 	    {
// 	        "bot-snippet":
// 	        {
// 	            "content": "Slack bot.."
// 	        }
// 	    }
// 	},function(err, res)
// 	{
// 	     console.log(err, res);
// 	});

//  github.issues.create({
//  		"owner":"lite",
// 		"repo": "log",
//     	"title": "slack bot issue.",
// 		"body" : "I am having a problem",
// 		"assignees" : ["lite"]
// 	},function(err, res)
// 	{
// 	     console.log(err, res);
// 	});