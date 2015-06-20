
var path = require('path');
var express = require('express');
var socketio = require('./server/socketio');

// Server part
var app = express();
app.use('/', express.static(path.join(__dirname, 'client')));

var server = app.listen(3000);
console.log('Server listening on port 3000');

// use socketio
socketio(server);
