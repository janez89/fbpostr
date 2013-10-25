
var async = require('async');

// Fb Post status
// 0: waiting
// 1: success 
// 2: failed

module.exports = function ($) {
	// új megosztás időzítése
	$.app.post('/post/:type/:id', function (req, res) {
		if (req.params.type !== 'user' && req.params.type !== 'page')
			return res.badRequest('Invalid type! Usage: /post/[user|page]/ID');

		if (!req.body.message)
			return res.badRequest('Missing message parameter!');

		// the post
		var post = { 
			uid:     req.params.id, 
			type:    req.params.type,
			owner:   '',
			message: req.body.message, 
			timed:   req.body.timed ? new Date(req.body.timed).getTime() : new Date().getTime(),
			status:  0 
		};

		// check user or fanpage exitstence
		if (post.type === 'user') {
			// check user
			$.db.account.findOne({id: post.uid}, function (err, user) {
				if (err || !user)
					return res.notFound();
				// set post owner
				post.owner = user.name;
				insertPost(post, function (doc) {
					res.json(doc);
				});
			});
		} else {
			// check fanpage
			$.db.fanpage.findOne({id: post.uid}, function (err, fanpage) {
				if (err || !fanpage)
					return res.notFound();
				// set post owner
				post.owner = fanpage.name;
				insertPost(post, function (doc) {
					res.json(doc);
				});
			});
		}
	});

	$.app.get('/post', function (req, res) {
		$.db.post.find({}, function (err, docs) {
			res.json({docs: docs});
		});
	});

	// --------- POST HANDLERS ------------------------------------------------
	// insert post method
	function insertPost (post, cbFinish) {
		// check the post time
		var time = new Date().getTime();
		if (post.timed < time)
			post.timed = time;

		$.db.post.insert(post, function (err, doc) {
			if (err)
				return res.internalError(err);
			// timed the post
			setTimeout(function () {
				$.vent.trigger('post:new', { post: doc }); // trigger post event
			}, post.timed - time );
			// finish
			cbFinish(doc);
		});
	}

	// get waiting posts from database
	function initializePosts () {
		// re timing posts
		$.db.post.find({status: 0}, function (err, posts) {
			if (err || !posts)
				return;
			var time = new Date().getTime(),
				count= 0;
			async.forEach(posts, function (post, next) {
				// check time
				var execTime = post.timed - time < 10 ? 10 : post.timed - time;
				// timed
				setTimeout(function () {
					$.vent.trigger('post:new', { post: post }); // trigger post event
				}, execTime );
				// call next procedure
				next();
			}, function (err) {
				console.log('%d posts timed!', count);
			});
		});

		// attach post event handler
		$.vent.bind('post:new', postMessage);
	}

	// post event handler
	function postMessage (params) {
		var post = params.post;

		var sendMessage = function (access_token) {
			var params = { 
				message: post.message, 
				access_token : access_token
			};

			$.graph.post('/'+ post.uid +'/feed', params, function (err, res) {
				if (err) {
					return $.db.post.update(
					{ _id: post._id}, 
					{ $set: { status: 2, err: err }}, 
					function (err2) {
						console.warn('Failed post! Owner: %s, Post Id: %s ', post._id, post.owner);
					});
				}
				// update records
				$.db.post.update({_id: post._id}, { $set: { status: 1, id: res.id }}, function (err) {
					console.log('Status posted on the facebook! ID: '+ res.id );
				});
			});
		};

		// fetch access token
		if (post.type === 'user') {
			$.db.account.findOne({id: post.uid}, function (err, doc) {
				if (err || !doc)
					return console.warn('Failed post! User %s (%s) not found!', post.owner, post.uid);
				sendMessage(doc.access_token);
			});
		} else {
			$.db.fanpage.findOne({id: post.uid}, function (err, doc) {
				if (err || !doc)
					return console.warn('Failed post! Fanpage %s (%s) not found!', post.owner, post.uid);
				sendMessage(doc.access_token);
			});
		}
	}

	// running handlers
	initializePosts();
};