var _ = require('underscore'); 
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var logger = require('morgan');

var local = require('./local.js');
var dumblebot = require('./dumblebot');
var gitpush = require('./hooks/gitpush');
var slack = require('./hooks/slack');

var app = express();
// app configure(function 
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!') });

app.post('/dumblebot', dumblebot);

app.post("/webhooks/github", gitpush.hooks);
app.post('/webhooks/slack', slack.hooks);

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler());
}

app.listen(process.env.PORT || 3000, function() {
  app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log(r.route.path, r.route.methods);
    }
  })

  console.log('Express listening on port', this.address().port);
});