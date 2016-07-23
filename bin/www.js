#!/usr/bin/env node
var app = require('../app');
var debug = require('debug')('room43');
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', process.env.PORT || 8001);
require('../appio.js')(io);

server.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
