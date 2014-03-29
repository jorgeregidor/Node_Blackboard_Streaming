
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var paint = require('./routes/paint');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/paint', paint.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

var nicknames = [];

io.sockets.on('connection',function(socket){
	socket.on('nickname',function(data, callback){
		
		if (nicknames.indexOf(data) != -1){
			callback(false);
		}else{
			callback(true);
			nicknames.push(data);
			socket.nickname = data;
			io.sockets.emit('nicknames', nicknames);
			
		}
	});

	socket.on('start paint',function (data){
		io.sockets.emit('start paint', {
			x: data.x,
			y: data.y,
			name: data.name
			
		});
	});

	socket.on('paint',function (data){
		io.sockets.emit('paint', {
			x: data.x,
			y: data.y,
			name: data.name
			
		});
	});

	socket.on('clear',function (){
		io.sockets.emit('clear');
	});

	socket.on('disconnect', function(){
		if (!socket.nickname) return;
		if (nicknames.indexOf(socket.nickname) > -1){
		nicknames.splice(nicknames.indexOf(socket.nickname),1);
		}
		io.sockets.emit('nicknames', nicknames);
	});
}); 