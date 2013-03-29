//
// Christophe Hamerling
// @chamerling
//
var express = require('express')
  , _ = require('underscore')
  , colors = require('colors')
  , play = require('ow2-playclient');

var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

var host = 'localhost';
var port = process.env.PORT || 3000;
var nb = 0;
var token = process.env.PLAY_APIKEY || 'dd2f852e8ca0f9e17b8d1f4c8a5a8848';

process.on('exit', function() {
  console.log('Bye, sent ' + nb + ' notifications in ' + process.uptime() + ' seconds');
});

var client = play.create({token: token});

app.get('/', function(req, res) {
  res.json({sent: nb, uptime:process.uptime()});
});

// TODO : Webapp!

app.listen(port, function(err) {
  console.log('Listening on port', port);
  
  // let's loop...
  setInterval(function() {
    client.topics().all(function(err, res) {
      _.each(res, function(e) {
        var stream = e.ns + e.name + '#stream';
        var message = 'This is message ' + nb++ + ' sent from nodejs client at ' + new Date() + ' on stream ' + stream;
        console.log('Publishing message to'.green, stream.underline.green);
        client.publish(stream, message, function(error, result) {
          if (error) {
            console.log('Error while sending message'.red, error)
          } else {
            console.log('HTTP Status (200 is OK, 401 is bad):'.green, result.statusCode)
          }
        })
      })
    })
  }, 2000);
});