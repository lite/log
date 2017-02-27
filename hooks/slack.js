var _ = require('underscore');
var kue = require('kue');

var local = require("../local");

var queue = kue.createQueue({ prefix: 'q', redis: local.redis });
var modules = [
    {
      regex: "^xkcd today.*",
      module: "xkcd.today"
    },
    {
      regex: "^xkcd$",
      module: "xkcd.random"
    },
    {
      regex: "^gitcup gist.*",
      module: "gitcup.create_gist"
    },
    {
      regex: "^gitcup issue.*",
      module: "gitcup.create_issue"
    }
  ];

// build out regex objects and functions to call when regex match occurs
var outgoingHookCommands = [];
var required = {};
_.each(modules, function(o){
  var module = o.module.split('.');
  if (!_.isObject(required[module[0]])){
    required[module[0]] = require("../modules/"+module[0]);
  }

  outgoingHookCommands.push({
    regex: new RegExp(o.regex,"i"),
    func: required[module[0]][module[1]]
  });
});

exports.hooks = function(req, res){
  
  console.log(req.body);
  // make sure token from slack's outgoing webhook is a match with config
  var validToken = false;
  if (_.isArray(local.slack.outgoing_webhook_token)){
    _.each(config.slack_config.outgoing_webhook_token, function(t){
      if (req.body.token === t){
        validToken = true;
        return false;
      }
    });
  }
  if (!validToken){
    res.status(404).send("invalid token");
    return;
  }
  
  // step through each configured command and run regex to find matches
  var found = false;
  _.each(outgoingHookCommands, function(o){
    if (_.isString(req.body.text) && req.body.text.match(o.regex) && _.isFunction(o.func)){
      found = true;
      var job = queue.create('createGist', { 
        content: req.body.text
      }).save( function(err){
        if( !err ) console.log( job.id );
      });
      // queue.process("slack", function(job, done){
      //   o.func(req.body.text, function(response){
      //     res.status(200).send({text:response, parse:"full"});
      //   });
      //   done();
      // });
      return false; // break loop
    }
  });

  // no listener found
  if (!found){
    res.status(200).send();
  }
};