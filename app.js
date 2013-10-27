
/*
 * FbPostr App
 * @author Janez <m.janee@gmail.com>
 */

var express  = require('express');
var app      = express(),
	graph    = require('fbgraph'),
	DB       = require('nedb'),
	db       = {},
	Event    = require('vent'),
	vent     = new Event(),
	config   = require('./config');

// initialize databases
db.account = new DB('./db/accounts.db');
db.fanpage = new DB('./db/fanpages.db');
db.post    = new DB('./db/posts.db');
// load databases
db.account.loadDatabase();
db.post.loadDatabase();
db.fanpage.loadDatabase();
// db index config
db.account.ensureIndex({ fieldName: 'id', unique: true });
db.fanpage.ensureIndex({ fieldName: 'id', unique: true });

// configuration
app.configure(function(){
	app.set('port', process.env.PORT || config.port);
	app.use(express.cookieParser());
	app.use(express.session({ key: 'fbpostr', secret: config.secret }));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(require('./response'));
	// check user is authorized
	app.use(function (req, res, next) {
		// exceptions
		if (req.path === '/' || 
			req.path === '/login' ||
			req.path === '/account/loginurl' ||
			req.path.match(/^\/app\/.*/) || 
			req.path.match(/^\/assets\/.*/))
			return next();

		if (!req.session.login)
			return res.unauthorized();
		// session alive
		next();
	});
	app.use(app.router);
	app.use(express.static(__dirname + '/public', { maxAge: 86400000 }));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// params for routes
var params = {
	app:      app,
	db:       db,
	config:   config,
	vent:     vent,
	graph:    graph,
	loginUrl: graph.getOauthUrl({
		"client_id":     config.facebook.client_id,
		"redirect_uri":  config.facebook.redirect_uri +'account/auth',
		"scope":         config.facebook.scope
	})
};

// routes
require('./routes/account')(params);
require('./routes/fanpage')(params);
require('./routes/post')(params);

app.listen(app.get('port'));
console.log('listen to http://localhost:%s/', app.get('port'));