var express = require('express'),
    wods = require('./routes/wods');

var app = express();

app.get('/crossfitwicked/wods', wods.findAll);
app.get('/crossfitwicked/wods/:id', wods.findById);

app.listen(3000);
console.log('Listening on port 3000...');