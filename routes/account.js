
var async = require('async');

module.exports = function ($) {

	// get facebook login url
	$.app.get('/account/loginurl', function (req, res) {
		res.json({ loginUrl: loginUrl });
	});

	$.app.get('/account/check', function (req, res) {
		$.db.account.count({}, function (err, count) {
			if (err)
				return res.badRequest();
			res.json({count: count, login: count >0, loginUrl: $.loginUrl});
		});
	});

	$.app.get('/account/check/:type/:id', function (req, res) {
		var types = { uid: 'user.id', mid: '_id', token: 'access_token'},
			cond = {};

		if (typeof types[req.params.type] === 'undefined')
			return res.badRequest('Missing parameter! Usage: /account/check/[uid|mid|token]/id');

		cond[types[req.params.type]] = req.params.id;

		$.db.account.findOne(cond, function (err, acc) {
			if (err || !acc) 
				return res.notFound();
			$.graph.get('/debug_token', 
			{ input_token: acc.access_token, access_token: acc.access_token },
			function (err, resp) {
				res.json(resp.data);
			});
		});
	});

	$.app.get('/account/:uid/loadpages', function (req, res) {
		$.db.account.findOne({id: req.params.uid}, function (err, user) {
			if (err || !user)
				return res.notFound();
			// get user fanpages
			$.graph.get('/me/accounts', { access_token: user.access_token }, function (err, resp) {
				if (!err && resp.data) {
					for (var i=0, len=resp.data.length; i < len; i++) {
						resp.data[i].uid = user.id;
						resp.data[i].owner = user.name;
					}

					async.forEachLimit(resp.data, 3, function (item, next) {
						// insert user pages
						$.db.fanpage.insert(item, next);
					}, function (err) {
						res.noContent();
					});
				}
			});
		});
	});

	// try login
	$.app.get('/account/auth', function (req, res) {
		if (!req.query.code) {
			if (!req.query.error) {
				res.redirect($.loginUrl);
			} else {
				res.send('Hozzáférés megtagadva!'); // TODO: hiba képernyő a bejelentkezés elutasításáról
			}
			return;
		}
		// authorize
		$.graph.authorize({
			"client_id":      $.config.facebook.client_id,
			"redirect_uri":   $.config.facebook.redirect_uri +'account/auth',
			"client_secret":  $.config.facebook.client_secret,
			"code":           req.query.code
		}, function (err, fbToken) {
			if (err)
				return res.json(err);
			// get user data
			$.graph.get('/me', { access_token: fbToken.access_token, fields: 'id,name,email,link' }, function (err, resp) {
				$.db.account.findOne({id: resp.id}, function (err, user) {
					if (!user)
						user = resp;
					// token
					user.access_token = fbToken.access_token;
					user.expires = fbToken.expires;
					user.created = user.created ? user.created : Date.now();
					$.db.account.update({id: resp.id}, { "$set": user }, { upsert: true}, function (err, numRep, upsert) {

					});

					// get user fanpages
					$.graph.get('/me/accounts', { access_token: fbToken.access_token }, function (err, resp) {
						if (!err && resp.data) {
							for (var i=0, len=resp.data.length; i < len; i++) {
								resp.data[i].uid = user.id;
								resp.data[i].owner = user.name;
							}
							// insert user pages
							$.db.fanpage.insert(resp.data, function (err) {});
						}
					});
				});
			});
			res.redirect('/');
		});
	});

	// get account list
	$.app.get('/account', function (req, res) {
		$.db.account.find({}, function (err, docs) {
			res.json({docs: docs, count: docs.length });
		});
	});

	// remove account
	$.app.del('/account/:uid', function (req, res) {
		// remove account
		$.db.account.remove({id: req.params.uid}, function (err, numRows) {
			// remove attached fan pages
			$.db.fanpage.remove({uid: req.params.uid}, { multi: true }, function (err, numRows) {
				res.noContent();
			});
		});
	});
};