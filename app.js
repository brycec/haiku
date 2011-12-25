
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose');

db = mongoose.connect("mongodb://bryce:asdfjkl@staff.mongohq.com:10015/dev");
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);


function initObjStore(req, res, next) {
	var ObjSchema = new mongoose.Schema();
	console.log(req.body);
	for (var key in req.body) {
		var x = {};
		x[key] = String;
		ObjSchema.add(x);
	}
	req.ObjModel = mongoose.model(req.params.object, ObjSchema);
	next();
}

function validateReq(req, res, next) {
	if (!req.is('json')) res.json("Content-Type was not JSON.", 500);
	next();
}

// Get single object
app.get('/a/:object/:id', initObjStore, function (req, res) {
	req.ObjModel.findById(req.params.id, function (err, doc) {
		res.json(doc);
	});
});

// Get object collection
app.get('/a/:object', initObjStore, function (req, res) {
	req.ObjModel.find({}, function (err, docs) {
		res.json(docs);
	});
});

// Create new object
app.post('/a/:object', validateReq, initObjStore, function (req, res) {
	var newObj = new req.ObjModel();
	for (var key in req.body) {
		newObj.set(key, req.body[key]);
	}
	
	newObj.save( function (err) {
		if (!err) res.json(newObj);
	});
});

// Update an object
app.put('/a/:object/:id', validateReq, initObjStore, function (req, res) {
	req.ObjModel.findById(req.params.id, function (err, doc) {
		for (var key in req.body) {
			doc.set(key, req.body[key]);
		}
		
		doc.save( function (err) {
			if (!err) res.json(doc);
			else res.json("Couldn't save.", 500);
		});
	});
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
