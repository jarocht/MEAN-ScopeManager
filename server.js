var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());
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
    console.log(req.params.id);
    ScopeRecord.remove({ _id: req.params.id }, function (err) {
        if (err) return console.error(err);
        res.send({ "removed": req.params.id });
    });
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

});

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
    "title": String
});
var User = mongoose.model('Users', userSchema);

var defaultSchema = mongoose.Schema({
    name: String
});
var Default = mongoose.model('Defaults', defaultSchema);

var user = new User({
    "name": "Tim Jaroch",
    "rank": 3,
    "title": "Software Engineer"
});

//user.save();