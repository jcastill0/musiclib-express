/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  console.log("api.name:" + req.user.email);
  res.json({
  	name: req.user.displayName
  });
};
