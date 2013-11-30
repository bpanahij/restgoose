module.exports = function(model) {
  /**
   * DELETE Verb
   * @param req
   * @param res
   */
  var deleteFunc = function(req, res) {
    model.findByIdAndRemove(req.params.id, function(err, doc) {
      if (err) {
        res.json({error: err});
        return;
      }
      res.json(doc);
    });
  };
  return deleteFunc;
}