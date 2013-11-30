var _ = require('underscore')
module.exports = function(model) {
  /**;
   * Restful POST (Create)
   * @param req
   * @param res
   */
  var postFunc = function(req, res) {
    var body = _.extend(req.body, req.restrictQuery);
    var newModel = new model(body);
    newModel.save(function(err, doc) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(doc);
    });
  };
  return postFunc;
}