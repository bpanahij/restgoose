var _ = require('underscore');
module.exports = function(model) {
  /**
   * GET Verb
   * @param req
   * @param res
   */
  var getFunc = function(req, res) {
    var memMB = process.memoryUsage().rss / 1048576;
    console.log('MB', memMB);
    var query = {
      _id: req.params.id
    };
    query = _.extend(query, req.restrictQuery);
    model.find(query, function(err, gotModel) {
      res.set('Content-Type', 'application/json');
      res.json(gotModel);
    });
  };
  return getFunc;
}