exports.create = function(req, res){
	var model = req.app.db.model.User;

	var person = {
		Name: req.body.Name,
		Phone: req.body.Phone,
		Email: req.body.Email,
		Address: req.body.Address,
		Age: parseInt( req.body.Age )
	};

	// Open a new file (document)
	var card = new model(person);

	// Save file (document)
	// See: https://docs.mongodb.com/manual/reference/method/db.collection.save/#db.collection.save
	card.save();

	res.end();
};

exports.read = function(req, res){
	var model = req.app.db.model.User;
	var filter;

	filter = {
	};	

	var vcard = model.find(filter, function(err, vcard) {
		res.send({
			users: vcard
		});
		res.end();
	});
};

/**
 * GET /1/user/:name
 */
exports.readByName = function(req, res){
	var model = req.app.db.model.User;
	var filter = {};
	var name = req.params.name;

	if (typeof name !== 'undefined') {
		// Regular expression
		var regex = new RegExp(name);
		filter.Name = { $regex: regex };
	};

	var vcard = model.find(filter, function(err, vcard) {
		res.send({
			users: vcard
		});
		res.end();
	});
};

exports.readByAge = function(req, res){
	var model = req.app.db.model.User;
	var age = req.params.age;

	//var vcard = model.find({ Age: age }, function(err, vcard) {
	//	res.send({
	//		users: vcard
	//	});
	//	res.end();
	//});

	model.aggregate([
	  { $match: { Age: parseInt(age) } }
	])
	.exec(function(err, users) {
		res.send({
			users: users
		});
		res.end();
	});
};

/**
 * GET /1/user/age/:from/:to
 */
exports.readByAgeRange = function(req, res){
	var model = req.app.db.model.User;
	var from = parseInt(req.params.from);
	var to = parseInt(req.params.to);

	model.aggregate([
		{ $match: { Age: {$gte: from} } },
		{ $match: { Age: {$lte: to} } },
		{ $sort: { Age: 1} }  
	])
	.exec(function(err, users) {
		res.send({
			users: users
		});
		res.end();
	});
};

function performanceNow() {
	var hr = process.hrtime();                                                            
	return hr[0] * 1e9 + hr[1];
}

/**
 * GET /1/user/report/age/:from/:to
 */
exports.readByReportAge = function(req, res){
	var model = req.app.db.model.AgeRange;
	var from = parseInt(req.params.from);
	var to = parseInt(req.params.to);

	model
	.aggregate([
		{ $project: {_id: 1, Names: 1} },
		{ $match: { _id: {$gte: from} } },
		{ $match: { _id: {$lte: to} } },
		{ $sort : { _id: 1 } }
	])
	.exec(function(err, docs) {
		var options = {
			path: 'Names',
			model: 'User'
		};
		model.populate(docs, options, function(err, users) {
			res.send({
				data: users
			});
		});
	});	
};

exports.update = function(req, res){
	var model = req.app.db.model.User;	
	var nickname = req.params.nickname;
	var filters = {};
	var fieldsToSet = {};

	if (typeof nickname !== 'undefined') {
		filters['Name'] = nickname;
	}

	fieldsToSet['$set'] = {};

	if (typeof req.body.Phone !== 'undefined') {
		fieldsToSet['$set'].Phone = req.body.Phone;
	}

	if (typeof req.body.Email !== 'undefined') {
		fieldsToSet['$set'].Email = req.body.Email;
	}

	model.update(filters, fieldsToSet)
	.exec(function(err, nModified) {
		res.end();
	});
};

exports.delete = function(req, res){
	var model = req.app.db.model.User;
	var nickname = req.params.nickname;

	model.remove({Name: nickname}, function(err, vcard) {
		res.end();
	});
};

exports.createPost = function(req, res){
  var model = req.app.db.model.Post;
  var uid = '545dc0b2a7678639e78366f1';
  var title = req.query.title;
  var content = req.query.content;

  var post = {
    uid: uid,
    title: title,
    content: content
  };

  var postDocument = new model(post);
  postDocument.save();

  res.send({status: 'OK'});
};

exports.readPost = function(req, res){
  var model = req.app.db.model.Post;

  model
  	.find({})
  	.populate('uid')
  	.exec(function(err, posts) {
	  	res.send({
	  		posts: posts
	  	});
	  	res.end();
  	});
};

exports.mapByAge = function(req, res) {
  var model = req.app.db.model.User;

  model
	.mapReduce(
		function() { emit( this.Age, this.Name); },
		function(key, values) { 
			return values.toString();
		},
		{
			query: { Age: { $gt: 30 } },
			out: 'map_ages'
		}
    );
};