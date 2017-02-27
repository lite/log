var http = require("http");
var GitHubApi = require("github");

var local = require('../local.js');

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
    token: local.github.api_token
});

exports.create_gist = function (text, callback){
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
    },function(err, res){
      console.log(err, res);
    });
};

exports.create_issue = function(text, callback){
   github.issues.create({
      "owner":"lite",
      "repo": "log",
      "title": "slack bot issue.",
      "body" : "I am having a problem",
      "assignees" : ["lite"]
     },function(err, res){
          console.log(err, res);
     });
};
