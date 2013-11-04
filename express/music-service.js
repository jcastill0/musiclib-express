var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    routes = require('./routes'),
    api = require('./routes/api'),
    config = require('./modules/config'),
    auth = require('./modules/auth'),
    User = require('./modules/user'),
    path = require('path');

var app = module.exports = express();
var google_callback = null;

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || config.serverPort);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.set("view engine", "ejs");
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser("ThisSecretRocks"));
app.use(express.bodyParser());
app.use(express.methodOverride());	// must come after bodyParser
app.use(express.session({secret:'ThisSecretRocks'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

config.createConnPool();

passport.serializeUser(function(gProfile, done) {
  if (config.debug)
      console.log("Serializing:", gProfile.id);
  done(null, gProfile.id);
});
passport.deserializeUser(function(googleID, done) {
  if (config.debug)
      console.log("Deserializing:" + googleID);
  user = new User();
  User.find(googleID, function (error, user) {
	if (error) {
	    return(done(error));
	}
	if (user != null) {
	    if (config.debug)
		console.log("FoundUser-OK:" + user.email);
	    done(null, user);
	} else {
	    console.log("FoundUser-BAD:" + googleID);
	    done("User not found");
	}
    });
});


// development only
if (app.get('env') === 'development') {
  google_callback = config.google_callback_dev;
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  google_callback = config.google_callback_prod;
};

passport.use(new GoogleStrategy({
    clientID: '680561429810.apps.googleusercontent.com',
    clientSecret: 'gRR2ir5camkaMzqukmFmw7fS',
    callbackURL: google_callback,
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  },
  function(accessToken, refreshToken, gProfile, done) {
    auth(gProfile, function (error, foundIt) {
	if (error) {
	    return(done(error));
	}
	if (foundIt) {
	    if (config.debug)
		console.log("Auth-OK:" + gProfile.displayName);
	    done(null, gProfile);
	} else {
	    console.log("Auth-BAD:" + gProfile.emails[0].value);
	    done(null, false, {message: 'Credentials not found'});
	}
    });
  }
));



/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/welcome', routes.welcome);
app.get('/partials/:name', routes.partials);
app.get('/partials/profile/userDetail', routes.profile);
app.get('/partials/playlist/:name', routes.playlist);
app.get('/partials/artist/:name', routes.artist);
app.get('/partials/artist/artistDetail', routes.artistDetail);
// JSON API
app.get('/api/name', api.name);
app.get('/api/playlists', api.playlists);
app.get('/api/playlists/:playlistID', api.playlists);
app.get('/api/playlists/:playlistID/songs', api.playlistSongs);
app.get('/api/artists', api.artists);
app.get('/api/artists/:artistID', api.artists);
app.get('/api/artists/:artistID/songs', api.artistSongs);
app.get('/api/songs', api.songs);
app.post('/api/playlists/:playlistID/songs', api.updatePlaylistSongs);
app.post('/api/playlists', api.createPlaylist);
app.put ('/api/playlists/:playlistID', api.updatePlaylist);
app.delete('/api/playlists/:playlistID', api.deletePlaylist);

app.get('/auth/google', passport.authenticate('google'));
app.get('/oauth2callback', 
	passport.authenticate('google', {
		successRedirect: '/welcome',
		failureRedirect: '/index'})
);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
