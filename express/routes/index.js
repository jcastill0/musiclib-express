
/*
 * GET home page.
 */

exports.index = function(req, res) {
  console.log("index.index");
  res.render('index');
};

exports.partials = function (req, res) {
  console.log("index.partials:" + req.params.name);
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.profile = function (req, res) {
  console.log("index.profile");
  var name = req.params.name;
  res.render('partials/profile/userDetail');
};



