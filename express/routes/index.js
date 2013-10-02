
/*
 * GET home page.
 */

exports.index = function(req, res) {
  console.log("index.index");
  res.render('index');
};

exports.welcome = function(req, res) {
  console.log("index.welcome:" + req.user.id);
  res.render('welcome');
}

exports.partials = function (req, res) {
  console.log("index.partials:" + req.user.id);
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.profile = function (req, res) {
  console.log("index.profile:" + req.user.id);
  var name = req.params.name;
  res.render('partials/profile/userDetail');
};

exports.playlist = function (req, res) {
  console.log("index.playlist:" + req.params.name);
  var name = req.params.name;
  res.render('partials/playlist/' + name);
};

exports.artist = function (req, res) {
  console.log("index.artist:" + req.params.name);
  var name = req.params.name;
  res.render('partials/artist/' + name);
};

exports.auth = function (req, res, done) {
  console.log("index.auth:" + req.params);
  res.redirect('partials/welcome');
};
