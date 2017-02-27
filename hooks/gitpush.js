/*
 * github hook processing
 */
var _ = require('underscore');
var kue = require('kue');

var local = require("../local");

var queue = kue.createQueue({ prefix: 'q', redis: local.redis });
var repos = [
    // {name: 'log', ref: 'master', action: chatSend},
    {name: 'log', ref: 'master'},
];

exports.hooks = function(req, res){
  console.log(req.body);

  var payload;
  if (typeof req.body.payload === 'object') {
      payload = req.body.payload;
  } else {
      payload = JSON.parse(req.body.payload);
  }

  _.each(repos, function(repo) {
    if(repo.name === payload.repository.name && payload.ref.indexOf(repo.ref) >= 0) {
      // repo.action(repo.name, repo.ref, payload);
      var job = queue.create('chatSend', { 
        repo: repo.name, branch: repo.ref, payload
      }).save( function(err){
        if( !err ) console.log( job.id );
      });
    }
  });

  res.status(200).send();
};
