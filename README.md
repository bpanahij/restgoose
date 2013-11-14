restgoose
=========

Restify Mongoose Models

Making Mongoose models in NodeJS RESTful, by making an Express middleware layer to automatically add REST methods to each model in a directory.


To install just use:

```sh
npm install restgoose
```

You can easily use restgoose like so:

```Javascript
// Connecting to Mongoose at server level
var mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost/my_database');
// Loading restful module
var restgoose = require('restgoose');
/** 
 * Using restgoose middleware at /resources URL,
 * for all models in models directory
 */
app.use('/resources', restgoose(__dirname + '/models'));
```
# Accessing via HTTP

Now, you can access your RESTful model by going to:
```
GET http://localhost/resources/ModelName/:_id
// Queries
GET http://localhost/resources/ModelName/?model_param=10
// Greater than query
GET http://localhost/resources/ModelName/?model_param_2>=20
// Less than query
GET http://localhost/resources/ModelName/?model_param3<=14
// Not equals query
GET http://localhost/resources/ModelName/?model_param_4!=hello
// Look ahead query
GET http://localhost/resources/ModelName/?model_param_5*=Look%20Ahead%20Query
// Limit and offset
GET http://localhost/resources/ModelName/?limit=10&offset=3
// Update
PUT http://localhost/resources/ModelName/:_id
// Create
POST http://localhost/resources/ModelName
// Delete
DELETE http://localhost/resources/ModelName
```
