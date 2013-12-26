
/*
 * GET home page.
 */

exports.index = function(req, res) {
  console.log("index.index:" + req.ip + ":" + req.params);
  res.render('index');
};

exports.welcome = function(req, res) {
  console.log("index.welcome:" + req.user.id);
  res.render('welcome');
}

exports.home = function(req, res) {
  console.log("index.home:" + req.user.id);
  res.render('home');
}

exports.partials = function (req, res) {
  console.log("index.partials:" + req.user.id);
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.users = function (req, res) {
  console.log("index.users:" + req.user.id);
  res.render('partials/admin/users');
};

exports.suggestion = function (req, res) {
  console.log("index.suggestion:" + req.user.id);
  res.render('partials/admin/suggestion');
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

exports.artistDetail = function (req, res) {
  console.log("index.artistDetail:");
  res.render('partials/artist/artistDetail');
};

exports.auth = function (req, res, done) {
  console.log("index.auth:" + req.params);
  res.redirect('partials/welcome');
};

exports.forbidden = function (req, res) {
  console.log("index.forbidden:" + req.ip + ":" +req.params);
  res.send(500, {Error:"Sorry, not through here"});
};

exports.musicSrc = function (req, res) {
  console.log("index.musicSrc:" + req.params);
  res.send(200);
};


