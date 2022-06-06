// Returns error (to website) if page doesn't work
var createError = require('http-errors');

var express = require('express');
var path = require('path');
var fetch = require("node-fetch");
var cookieParser = require('cookie-parser');
var csrf = require('csurf');

// Updates console with website activity (e.g GET /register 200 212.849 ms - 502)
var logger = require('morgan');

var admin = require('firebase-admin');

// <==================== SERVER-SIDE ANALYTICS OBJECT ====================>
var analytics = {
  bookmarks: 0,
  visitors: 0,
  jobSearches: 0
}

// passing analytics to these routes in order for them to update
// uses pass by reference in order to update/increment by one
var indexRouter = require('./routes/index')(analytics);
var jobsRouter = require('./routes/jobs')(analytics);

var mapsRouter = require('./routes/maps');
var profileRouter = require('./routes/profile');
var userRouter = require('./routes/user');
const routes = require('./routes')
const {key} = require('./config/serviceAccountKey');
const { saveAnalyticsCount, clearDailyVisitors } = require('./routes/helperFunctions/serverAnalytics')

// Initialises the Express server
var app = express();

// Initialises middleware to prevent CSFR attacks - SECURITY (between client n server communication)
const csrfMiddleware = csrf({ cookie: true });

// initialised admin firebase to be used in server side
admin.initializeApp({
  credential: admin.credential.cert(key)
})

// environment files ".env", handles that
require("dotenv").config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrfMiddleware);

  //sends xsrf token to frontend, then frontend checks the value and sends it back
  // this is to make sure that the correct client is legitimate
app.all("*", (req, res, next) => {
  res.locals.currentURL = req.url;
  res.cookie("XSRF-TOKEN", req.csrfToken());

  try{
    const visited = req.headers.cookie.split("; ").find((row) => row.startsWith("Visited="))
    // visited cookie expires in One day
    // This means AFTER 24 HOURS IF A USER TRIES TO COME BACK TO THE SITE, IT WILL INCREMENT THE 'Daily visitors' counter by one in the home page
    if(!visited){
      res.cookie("Visited", true, {maxAge: 60 * 60 * 24 * 1 * 1000})
      analytics.visitors++;
    }
  }catch(e){
    
  }
  next();
});


// <==================== SERVER-SIDE ANALYTICS ====================>

// updates the analytics table in the database with the variables used here in the server site
// this code below runs once at the start, when the server starts running
saveAnalyticsCount(analytics)
// this set interval code then runs the function inside of it every 1 hour
setInterval(() => {
  saveAnalyticsCount(analytics)
}, 3600000)


// the routes are stored in routes/index.js for this
// each route in that file starts with '/' which is why it is stated here first below
// app.use('/', {indexRouter, jobsRouter, mapsRouter, profileRouter, userRouter});
app.use('/', indexRouter)
app.use('/', userRouter)
app.use('/', profileRouter)
app.use('/', mapsRouter)
app.use('/', jobsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// Exports app.js so server.js can require it (is there a way to make it so only server.js can access this?)
module.exports = app;