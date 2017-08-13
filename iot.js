///////////////// MongoDB ////////////////////////

var mongoose = require('mongoose');
mongoose.connect('mongodb://jollen:123456@ds035766.mlab.com:35766/measurements');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('MongoDB: connected.');	
});

var sensorByRawSchema = mongoose.Schema({
    sensor_id: { type: String },
    temperature: {type: Number },
    timestamp: { type: Date }
});

var sensorByDeviceSchema = mongoose.Schema({
    sensor_id: { type: String },
	data: [{ 
		temperature: { type: Number },
		timestamp: { type: Date }
	}] 
});

// See:
// [2] https://www.mongodb.com/presentations/mongodb-time-series-data-part-1-setting-stage-sensor-management
// [1] https://www.slideshare.net/NoSQLmatters/ted-dunning-very-high-bandwidth-time-series-database-implementation-nosql-matters-barcelona-2014
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

sensorByColumnSchema.statics.updateData = function(data) {
	var self = this;
	self
	.find({ 
		timestamp: {$lte: data.timestamp}
	})
	.sort({timestamp: -1})
	.limit(1)
	.exec(function (err, docs) {
		var s = new Date(docs[0].timestamp).getTime();
		var interval = parseInt( (data.timestamp - s) / 10000 );		
		var fieldsToSet = {};

		switch (interval) {
		case 0: fieldsToSet['$push'] = { 'column00.data': data }; break;
		case 1: fieldsToSet['$push'] = { 'column10.data': data }; break;
		case 2: fieldsToSet['$push'] = { 'column20.data': data }; break;
		case 3: fieldsToSet['$push'] = { 'column30.data': data }; break;
		case 4: fieldsToSet['$push'] = { 'column40.data': data }; break;				
		case 5: fieldsToSet['$push'] = { 'column50.data': data }; break;		
		}

		self.update(
			{ _id: docs[0]._id },
			fieldsToSet
		).exec(function(err, nModified) {
			return nModified;
		});		
	});
};

var Model = mongoose.model('Sensor', sensorByColumnSchema);


///////////////// IoT ////////////////////////

var WebSocketClient = require('websocket').w3cwebsocket;
var client = new WebSocketClient('wss://wot.city/object/testman/viewer');

client.onopen = function() {
    console.log('WebSocket Client: Server Connected');
};

client.onmessage = function(e) {
    var obj = JSON.parse(e.data);
    console.log(
    	"[" 
    	+ obj.sensor_id
    	+ "] " 
    	+ obj.temperature 
    	+ " (" + obj.timestamp 
    	+ ")"
    );

    if (typeof obj.sensor_id === 'undefined')
    	return;

    //var doc = new Model(obj);
    //doc.save();

    //var doc = { 
    //	timestamp: obj.timestamp, 
    //	temperature: obj.temperature 
    //};
	//
	//Model
	//.update({ sensor_id: obj.sensor_id }
	//	  , { $set: {sensor_id: obj.sensor_id}, $push: {data: doc} }
	//	  , { upsert: true })
	//.exec(function(err, nModified) {
	//	return;
	//});

	var data = {
		timestamp: obj.timestamp,
		temperature: obj.temperature,
		sensor_id: obj.sensor_id
	};

	Model.updateData(data);
};



