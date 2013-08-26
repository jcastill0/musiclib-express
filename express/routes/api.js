/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  console.log("api.name");
  res.json({
  	name: 'Julio'
  });
};
