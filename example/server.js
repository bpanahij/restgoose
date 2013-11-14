/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , resting_mongoose = require('../restgoose');
/**
 *  Establishing database connectivity for entire server side app
 */
mongoose.connect('mongodb://localhost/my_database');
/**
 * Creating server app
 */
var app = express();
app.set('port', 8081);
/**
 * Provide restful data services /resources
 */
app.use('/resources', resting_mongoose(__dirname + '/models'));
/**
 * Starting Express HTTP Server
 */
http.createServer(app).listen(app.get('port'), function() {
  console.log('RESTGoose Server listening on port ' + app.get('port'));
});
