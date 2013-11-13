restgoose
=========

Restify Mongoose Models

Making Mongoose models in NodeJS RESTful, by making an Express middleware layer to automatically add REST methods to each model in a directory.

```Javascript
// Loading restful module
var restful = require(__dirname + '/middleware/restful');
/** 
 * Using restful middleware at /resources URL, 
 * for all models in models directory
 */
app.use('/resources', restful(__dirname + '/models'));
```
