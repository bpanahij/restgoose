/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , resting_mongoose = require('../index');
//var heapdump = require('heapdump');
//var nextMBThreshold = 0;
//setInterval(function() {
//  var memMB = process.memoryUsage().rss / 1048576;
//  console.log('MB', memMB);
//  if (memMB > nextMBThreshold) {
//    heapdump.writeSnapshot();
//    nextMBThreshold += 100;
//  }
//}, 6000 * 2);
/**
 *  Establishing database connectivity for entire server side app
 */
mongoose.connect('mongodb://localhost/my_database');
/**
 * Creating server app
 */
var app = express();
app.set('port', 8080);
var oneDay = 86400000;
var coreAssets = __dirname + '/../client';
app.use(express.static(coreAssets, { maxAge: oneDay }));
/**
 * Provide restful data services /resources
 */
var configuration = {
  host: 'localhost:8080',
  version: 'v1.0',
  rel: ''
};
app.use('/api', resting_mongoose(__dirname + '/models', configuration));
/**
 * Starting Express HTTP Server
 */
http.createServer(app).listen(app.get('port'), function() {
  console.log('RESTGoose Server listening on port ' + app.get('port'));
});
