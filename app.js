var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJWT = require('express-jwt');

var index = require('./routes/index');
var users = require('./routes/users');
var contacts = require('./routes/api/contacts');
var app = express();

var User = require('./models/User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(expressJWT({secret:'secret'}).unless({path:['/login']}));



app.use('/', index);
app.use('/users', users);
app.use('/api/contacts', contacts);




app.post('/login', function(req, res){


	console.log("checkpoint");
    if(!req.body.username) res.status(400).send({error:"no username provided"});
    if(!req.body.password) res.status(400).send({error:"no password provided"});

    User.get(req.body.username, function(err, user){
    	if(err){
    		console.log(err);
    		res.status(404).send(err);
    	} else{

    		if(user.attrs.password != req.body.password){
    			console.log(user);
    			res.status(401).send("wrong password");
    		}else{
    			res.status(200).send(jwt.sign({username: user.attrs.username}, 'secret'));
    		}

    	}
    });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
