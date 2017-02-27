var kue = require('kue');
var exec = require('child_process').exec;
var WebClient = require('@slack/client').WebClient;

var local = require('../local.js');

var queue = kue.createQueue({ prefix: 'q', redis: local.redis });

queue.process('chatSend', function(job, done){
  console.log('working on a chatSend job', job.data);

  // https://api.slack.com/docs/oauth-test-tokens?team_id=T037CM3Q6&action=reissue&sudo=1
  // var web = new WebClient(local.slack.api_token);
  // web.chat.postMessage('#log', 'hello from @slack/client', function(err, res) {
  //   if (err) {
  //     console.log('Error:', err);
  //   } else {
  //     console.log('Message sent: ', res);
  //   }
  // });
}

queue.process('createGist', function(job, done){
  console.log('working on a createGist job', job.data);
}
