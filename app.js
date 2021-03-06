
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var templet = require('./routes/templet');
var diary = require('./routes/diary/diary');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here, haha my secret'));
app.use(express.session());
app.use(function(req, res, next){
	if(req.session.user){
		// 60秒session过期
		var sessionTime = req.session.user.date;
		if(new Date().getTime() - sessionTime > 60000){
			req.session.user = null;
		}else{
			req.session.user = {date: new Date().getTime()};
		}
	}
	next();
});
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/usersession', user.session);
app.get('/templet/:name', templet.getTemplet);
app.get('/diary/:name', diary.get);
app.post('/diary/:name', diary.post);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
