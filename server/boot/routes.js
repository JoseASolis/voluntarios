module.exports = function(app) {
  app.post('/mailing_list', function(req, res) {
      console.log(req.body.email);
      res.send({"status": 1, "message": "Successfully added to mailing list."})
  });
}
