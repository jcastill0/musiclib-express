
/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.set("view engine", "ejs");
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

passport.serializeUser(function(user, done) {
  console.log("Serializing:", user.id);
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log("Deserializing:" + id);
  done(null, obj);
});
/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("Authenticating.....:" + username);
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
*/

passport.use(new GoogleStrategy({
    clientID: '680561429810.apps.googleusercontent.com',
    clientSecret: 'gRR2ir5camkaMzqukmFmw7fS',
    //callbackURL: 'http://www.guantanamera.us/oauth2callback',
    callbackURL: 'http://localhost:3000/oauth2callback',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("Strat: " + profile.id);
    console.log("Strat: " + profile.displayName);
    console.log("Strat: " + profile.emails[0].value);
    done(null, profile);
  }
));


// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/partials/profile/userDetail', routes.profile);
app.get('/partials/playlist/:name', routes.playlist);
app.get('/partials/artist/:name', routes.artist);
// JSON API
app.get('/api/name', api.name);

app.get('/auth/google', passport.authenticate('google'));
app.get('/oauth2callback', 
	passport.authenticate('google', {
		successRedirect: '/index',
		failureRedirect: '/partials/welcome'})
);
app.post('/auth/login',
	passport.authenticate('local', {
		successRedirect:'/partials/playlist/playlists',
		failureRedirect:'/partials/welcome'
		}),
	function (req, res) {console.log("Made it here");}
);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
