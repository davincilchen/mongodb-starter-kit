///////////////// MongoDB ////////////////////////

var mongoose = require('mongoose');

var sensorByColumnSchema = mongoose.Schema({
    timestamp: { type: Date },
	column00: {
		data: [{ 
			temperature: { type: Number },
			timestamp: { type: Date },
			sensor_id: { type: String }
		}],
		maxTemperature: { type: Number, default: -9999 },
		minTemperature: { type: Number, default:  9999 }
	},
	column10: {
		data: [{ 
			temperature: { type: Number },
			timestamp: { type: Date },
			sensor_id: { type: String }
		}],
		maxTemperature: { type: Number, default: -9999 },
		minTemperature: { type: Number, default:  9999 }		
	},
	column20: {
		data: [{ 
			temperature: { type: Number },
			timestamp: { type: Date },
			sensor_id: { type: String }
		}],
		maxTemperature: { type: Number, default: -9999 },
		minTemperature: { type: Number, default:  9999 }		
	},
	column30: {
		data: [{ 
			temperature: { type: Number },
			timestamp: { type: Date },
			sensor_id: { type: String }
		}],
		maxTemperature: { type: Number, default: -9999 },
		minTemperature: { type: Number, default:  9999 }		
	},
	column40: {
		data: [{ 
			temperature: { type: Number },
			timestamp: { type: Date },
			sensor_id: { type: String }
		}],
		maxTemperature: { type: Number, default: -9999 },
		minTemperature: { type: Number, default:  9999 }		
	},		
	column50: {
		data: [{ 
			temperature: { type: Number },
			timestamp: { type: Date },
			sensor_id: { type: String }
		}],
		maxTemperature: { type: Number, default: -9999 },
		minTemperature: { type: Number, default:  9999 }		
	},	
});

var Model = mongoose.model('Sensor', sensorByColumnSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
 	console.log('MongoDB: connected.');	

 	var data = {
 		timestamp: '2017-08-13T08:11:03.000Z'
 	}

	Model
	.aggregate([
		{ $match: { timestamp: {$lte: new Date(data.timestamp) } } },
		{ $sort : { timestamp: -1 } },
		{ $limit: 1 }
	])
	.exec(function(err, docs) {
		var s = new Date(docs[0].timestamp).getTime();
		var interval = parseInt( (new Date(data.timestamp).getTime() - s) / 10000 );		
		var path = '';

		switch (interval) {
		case 0: path = 'column00'; break;
		case 1: path = 'column10'; break;
		case 2: path = 'column20'; break;
		case 3: path = 'column30'; break;
		case 4: path = 'column40'; break;				
		case 5: path = 'column50'; break;		
		}

		for (i = 0; i < docs[0][path].data.length; i++) {
			var d = docs[0][path].data[i];
			console.log('[' + i + ']' + new Date(d.timestamp) + '-> ' + d.temperature + ', id = ' + d.sensor_id);
		}
	});	
});

mongoose.connect('mongodb://jollen:123456@ds035766.mlab.com:35766/measurements');

