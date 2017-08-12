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

exports.readByAgeRange = function(req, res){
	var model = req.app.db.model.User;
	var from = parseInt(req.params.from);
	var to = parseInt(req.params.to);

	model.aggregate([
	  { $match: { Age: {$gte: from} } },
	  { $match: { Age: {$lte: to} } }
	])
	.exec(function(err, users) {
		res.send({
			users: users
		});
		res.end();
	});
};

exports.update = function(req, res){
	var nickname = req.params.nickname;

	vcard.forEach(function (entry) {
		if (entry.nickname === nickname) {
			console.log('found!');

			entry.name =  req.query.name;
			entry.tel =  req.query.tel;
		}
	});

	res.end();
};

exports.delete = function(req, res){
	res.end();
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