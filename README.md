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
