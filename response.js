/**
 * Response helpers
 * @author Janez <m.janee@gmail.com>
 *
 */

module.exports = function (req, res, next) {
	// -------- response helpers -------------------------------
	// 2xx - success responses
	res.created = function (msg) {
		res.status(201).send(msg);
	};
	res.noContent = function () {
		res.status(204).send();
	};
	// 4xx - error responses
	res.badRequest = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(400).send({msg: msg || 'Bad Request', err: err});
	};
	res.unauthorized = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(401).send({msg: msg || 'Unauthorized', err: err});
	};
	res.forbidden = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(403).send({msg: msg || 'Forbidden', err: err});
	};
	res.notFound = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(404).send({msg: msg || 'Not Found', err: err});
	};
	res.notAllowed = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(405).send({msg: msg || 'Method Not Allowed', err: err});
	};
	// 5xx - error responses
	res.internalError = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(500).send({msg: msg || 'Internal Server Error', err: err});
	};
	res.notImplemented = function (msg, err) {
		err = typeof err !== 'undefined' ? err : true;
		res.status(501).send({msg: msg || 'Method Not Implemented', err: err});
	};
	// call next procedure
	next();
};