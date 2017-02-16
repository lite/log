var local = require('./local.js');
var _ = require('underscore'); 
var WebClient = require('@slack/client').WebClient;

// https://api.slack.com/docs/oauth-test-tokens?team_id=T037CM3Q6&action=reissue&sudo=1
var token = local.slack_api_token;

var web = new WebClient(token);
web.chat.postMessage('#log', 'hello from @slack/client', function(err, res) {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Message sent: ', res);
    }
});

var GitHubApi = require("github");

var github = new GitHubApi({
    // optional
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "", // for some GHEs; none for GitHub
    headers: {
        "user-agent": "dogfish api" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});

github.authenticate({
    type: "oauth",
    token: local.github_api_token
});

github.gists.create({
	    "description": "slack bot gist.",
	    "public": false,
	    "files":
	    {
	        "bot-snippet":
	        {
	            "content": "Slack bot.."
	        }
	    }
	},function(err, res)
	{
	     console.log(err, res);
	});

 github.issues.create({
 		"owner":"lite",
		"repo": "log",
    	"title": "slack bot issue.",
		"body" : "I am having a problem",
		"assignees" : ["lite"]
	},function(err, res)
	{
	     console.log(err, res);
	});