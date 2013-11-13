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
// Loading restful module
var restful = require('restgoose');
/** 
 * Using restful middleware at /resources URL, 
 * for all models in models directory
 */
app.use('/resources', restful(__dirname + '/models'));
```
