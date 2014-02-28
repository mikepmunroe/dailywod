var express = require('express'),
    mongoose = require('mongoose'),
    wods = require('./routes/wods');

mongoose.connect('mongodb://localhost/dailywod');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});

var app = express();

app.get('/crossfitwicked/wods', wods.findAll);
app.get('/crossfitwicked/wods/:id', wods.findById);

app.listen(3000);
console.log('Listening on port 3000...');