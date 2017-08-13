{
    var db = connect('mongodb://jollen:123456@ds151242.mlab.com:51242/vcard');

    db.users.aggregate([
	  	{ 
	  		$group: {
	  			_id: '$Age',
	  			nUsers: { $sum: 1 },
	  			Names: { $push: '$_id' }
	  		}
	  	},
  		{ $sort: { _id: 1} },
	  	{ $out: 'ageranges' }
	]);
}