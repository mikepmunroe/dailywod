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
var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/dailywod';

mongoose.connect(uristring);
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

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Listening on " + port);
});