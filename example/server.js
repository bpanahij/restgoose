/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , restgoose = require('restgoose');
/**
 *  Establishing database connectivity for entire server side app
 */
mongoose.connect('mongodb://localhost/my_database');
/**
 * Creating server app
 */
var app = express();
app.set('port', 80);
/**
 * and configuring Middle-ware
 */
app.use(express.methodOverride());
/**
 * Optional router
 */
app.use(app.router);
/**
 * Provide restful data services /resources
 */
app.use('/resources', restgoose(__dirname + '/models'));
/**
 * Starting Express HTTP Server
 */
http.createServer(app).listen(app.get('port'), function() {
  console.log('RESTGoose Server listening on port ' + app.get('port'));
});
