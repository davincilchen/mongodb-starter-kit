
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var busboy = require('connect-busboy');
var api = require('./routes/api');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://jollen:123456@ds151242.mlab.com:51242/vcard');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('MongoDB: connected.');	
});

var vcardSchema = mongoose.Schema({
    Name: String,
    Phone: String,
    Email: String,
    Address: String,
    Age: Number
});

app.db = {
	model: {
		User: mongoose.model('User', vcardSchema)
	}
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(busboy({ immediate: true }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// REST API
app.post('/1/user', api.create);
app.get('/1/user', api.read);
app.get('/1/user/:name', api.readByName);
app.put('/1/user/:nickname', api.update);
app.delete('/1/user/:nickname', api.delete);

app.get('/1/user/age/:age', api.readByAge);
app.get('/1/user/age/:from/:to', api.readByAgeRange);

// Data analysis
app.get('/1/user/report/age/:from/:to', api.readByReportAge);

// MapReduce
app.get('/1/user/map/age', api.mapByAge);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
