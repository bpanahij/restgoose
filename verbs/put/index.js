var _ = require('underscore');
module.exports = function(model) {
  /**
   * Restful PUT (Save)
   * @param req
   * @param res
   */
  var putFunc = function(req, res) {
    console.log(req.headers);
    console.log(req.body);
    var body = _.extend(req.body, req.restrictQuery);
    var savedModel = new model(body);
    var upsertData = savedModel.toObject();
    delete upsertData._id;
    model.update({_id: savedModel._id}, upsertData, {}, function(err, doc) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(doc);
    });
  };
  return putFunc;
}