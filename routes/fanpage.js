/**
 * Facebook routes
 */

module.exports = function ($) {

	$.app.get('/fanpage', function (req, res) {
		$.db.fanpage.find({}, function (err, docs) {
			res.json({docs: docs, count: docs.length });
		});
	});

	$.app.del('/fanpage/:id', function (req, res) {
		$.db.fanpage.remove({id: req.params.id}, function (err, numRows) {
			res.noContent();
		});
	});

}