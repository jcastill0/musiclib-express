var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    routes = require('./routes'),
    api = require('./routes/api'),
    config = require('./modules/config'),
    auth = require('./modules/auth'),
    User = require('./modules/user'),
    path = require('path'),
    cookieParser = require ('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    multer = require('multer');

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
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));
app.use(cookieParser("ThisSecretRocks"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer({ dest: 'public/data'}));
app.use(methodOverride());	// must come after bodyParser
app.use(session({secret:'ThisSecretRocks',saveUninitialized:true,resave:true}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);

config.createConnPool();
config.createMailTransport();

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
  app.use(errorHandler());
  console.log("DEVELOPMENT ENV");
}

// production only
if (app.get('env') === 'production') {
  google_callback = config.google_callback_prod;
  app.use(errorHandler());
  console.log("PRODUCTION ENV");
};

passport.use(new GoogleStrategy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: google_callback,
    scope: config.googleScope
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
app.get('/home', routes.home);
app.get('/partials/:name', routes.partials);
app.get('/partials/profile/userDetail', routes.profile);
app.get('/partials/playlist/:name', routes.playlist);
app.get('/partials/artist/:name', routes.artist);
app.get('/partials/artist/artistDetail', routes.artistDetail);
app.get('/partials/video/:name', routes.video);
app.get('/partials/song/songs', routes.searchSongs);
app.get('/partials/song/songDetail', routes.songDetail);
app.get('/partials/song/songAdd', routes.songAdd);
app.get('/partials/song/songUpload', routes.songUpload);
app.get('/partials/song/songLyrics', routes.songLyrics);
app.get('/partials/admin/users', routes.users);
app.get('/partials/admin/suggestion', routes.suggestion);
// JSON API
app.get ('/musiclib/api/name', api.name);
app.get ('/musiclib/api/users', api.users);
app.get ('/musiclib/api/stats', api.stats);
app.post('/musiclib/api/suggestion', api.suggestion);
app.get ('/musiclib/api/playlists', api.playlists);
app.get ('/musiclib/api/playlists/:playlistID', api.playlists);
app.get ('/musiclib/api/playlists/:playlistID/songs', api.playlistSongs);
app.get ('/musiclib/api/artists', api.artists);
app.get ('/musiclib/api/artists/:artistID', api.artists);
app.get ('/musiclib/api/artists/:artistID/songs', api.artistSongs);
app.get ('/musiclib/api/videos', api.videos);
app.get ('/musiclib/api/videos/:videoID', api.videos);
app.post('/musiclib/api/videos', api.createVideo);
app.get ('/musiclib/api/search/videos/recent', api.recentVideos);
app.delete('/musiclib/api/videos/:videoID', api.deleteVideo);
app.get ('/musiclib/api/songs', api.songs);
app.post('/musiclib/api/songs', api.createSong);
app.post('/musiclib/api/songs/upload', api.uploadSong);
app.put ('/musiclib/api/songs/:songID', api.updateSong);
app.put ('/musiclib/api/songs/count/:songID', api.updateSongCnt);
app.put ('/musiclib/api/songs/lyrics/:songID', api.updateLyrics);
app.get ('/musiclib/api/songs/lyrics/:songID', api.songLyrics);
app.get ('/musiclib/api/search/songs/query/:queryTerm', api.searchSongs);
app.get ('/musiclib/api/search/songs/recent', api.recentSongs);
app.get ('/musiclib/api/search/songs/popular', api.popularSongs);
app.get ('/musiclib/api/search/songs/frequent', api.frequentlyPlayedSongs);
app.get ('/musiclib/api/search/playlists/popular', api.popularPlaylists);
app.post('/musiclib/api/playlists/:playlistID/songs', api.updatePlaylistSongs);
app.post('/musiclib/api/playlists', api.createPlaylist);
app.put ('/musiclib/api/playlists/:playlistID', api.updatePlaylist);
app.delete('/musiclib/api/playlists/:playlistID', api.deletePlaylist);

app.get ('/auth/google', passport.authenticate('google'));
app.get ('/auth/oauth2callback', 
	passport.authenticate('google', {
		successRedirect: '/welcome',
		failureRedirect: '/'})
);
app.get('/auth/logout', routes.logout);

app.get ('/MusicSrc/*', routes.musicSrc);
//app.get ('/data/songs/*', routes.musicSrc);

// redirect all others to the index (HTML5 history)
app.get ('*', routes.forbidden);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
