var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var fs = require('fs');
var https = require('https');
//NOTE: These file paths will have to be absolute if installed as a service
var cert = fs.readFileSync('./certificate.pem');
var mid_ca = fs.readFileSync('./mid-certificate.pem');
var int_ca = fs.readFileSync('./int-certificate.pem');
var https_options = {
    key: cert,
    cert: cert,
    ca: [int_ca, mid_ca]
};
var PORT = 3000;

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.contentType('application/json');
    next();
});

//Users, sorted by rank, ascending
app.get('/users', function (req, res) {
    User.find({}, null, { sort: {rank: 1} }, function (err, users) {
        if (err) return console.error(err);
        res.send(users);
    });
});

//User Records, by owner (:name), sorted by priority, ascending
app.get('/user/:name', function (req, res) {
    ScopeRecord.find({ "owner": req.params.name }, null, {sort: {priority: 1} }, function (err, records) {
        if (err) return console.error(err);
        res.send(records);
    });
});

app.get('/types', function (req, res) {
    ScopeTypes.findOne(function (err, types) {
        if (err) return console.error(err);
        res.send(types);
    });
});

app.get('/records', function (req, res) {
    ScopeRecord.find(function (err, records) {
        if (err) return console.error(err);
        res.send(records);
    });
});

app.post('/remove/:id', function (req, res) {
    ScopeRecord.remove({ _id: req.params.id }, function (err) {
        if (err) return console.error(err);
        res.send({ "removed": req.params.id });
    });
});

app.post('/update', function(req, res) {
    ScopeRecord.findById(req.body._id, function(err, record) {
        record.customerName = req.body.customerName;
        record.engagementManager = req.body.engagementManager;
        record.gearsId = req.body.gearsId;
        record.hours = req.body.hours;
        record.priority = req.body.priority;
        record.typeRefNumber = req.body.typeRefNumber;
        record.owner = req.body.owner;

        record.save(function (errr) {
            if (errr) return console.error(errr);
            res.send({ "updated": req.body._id });
        });
    });
});

app.post('/add', function (req, res) {
    var record = new ScopeRecord(req.body);
    record.save(function (err, post) {
        if (err) return console.error(err);
        res.send({ "success": true });
    });
});

server = https.createServer(https_options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);

mongoose.connect('mongodb://Jaroch02.supportlab.inin.com/test');
//mongoose.set('debug', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("MongoDB Connection Successful");
});

var recordSchema = new mongoose.Schema({
    "customerName": String,
    "engagementManager": String,
    "gearsId": Number,
    "hours": Number,
    "priority": Number,
    "typeRefNumber": Number,
    "owner": String
});
var ScopeRecord = mongoose.model('Records', recordSchema);

var scopeTypeSchema = mongoose.Schema({
    list: []
});
var ScopeTypes = mongoose.model('Types', scopeTypeSchema);

var userSchema = new mongoose.Schema({
    "name": String,
    "rank": Number,
    "title": String,
    "hours": Number
});
var User = mongoose.model('Users', userSchema);

var defaultSchema = mongoose.Schema({
    name: String
});
var Default = mongoose.model('Defaults', defaultSchema);