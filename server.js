var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');


// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

mongoose.connect('mongodb://localhost/dailywod');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});

var app = express();
app.configure(function(){
  app.use(express.static(__dirname));
});

var wods = require('./routes/wods');
app.get('/crossfitwicked/wods', wods.findAll);
app.get('/crossfitwicked/wods/:id', wods.findById);

app.listen(3000);
console.log('Listening on port 3000...');