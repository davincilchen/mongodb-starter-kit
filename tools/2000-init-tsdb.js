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

	///////////////// Insert Timestamps ////////////////////////

	var date = new Date();
	var start = Math.round(date.getTime() / 1000 /* in seconds */ ); 
	var end = start + ( 60*60 /* 1 hour */ );

	var PERIOD = 60; // 1min

	while (start <= end) {
		var obj = {
			timestamp: start * 1000
		};
	    var doc = new Model(obj);
	    doc.save();

		start = start + PERIOD;	    
	}

	console.log('MongoDB: TSDB initialized.');
});

mongoose.connect('mongodb://jollen:123456@ds035766.mlab.com:35766/measurements');

