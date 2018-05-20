const db = require("./model/database.js");
const user = require("./routes/user.js");
const poll = require("./routes/poll.js");
const bodyParser = require('body-parser');
const path = require('path');

// hbs pulls in handlebars, so we don't need to require it.
//const handlebars = require("handlebars");
const hbs = require("hbs");
var express = require('express');

var app = express();

// We need sessions here - https://github.com/expressjs/session
var session = require('express-session');

// Init the sessions middleware.
app.use( session({
  name: "fcc-voting-app-session",
  secret: process.env.EXPRESS_SESSION_SECRET,  // From .env file
  resave: false,
  saveUninitialized: true
}));

// Start up out database access.
db.init();
//db.test();


// http://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')));


// Set our templating engine.
app.set('view engine', 'hbs');
//https://stackoverflow.com/questions/16385173/node-js-express-handlebars-js-partial-views
hbs.registerPartials(__dirname + '/views');


// REFERENCE: http://blog.teamtreehouse.com/handlebars-js-part-3-tips-and-tricks
hbs.handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Handlebars Debug Current Context");
  console.log("================================");
  console.log(this);
 
  if (optionalValue) {
    console.log("Handlebars Debug Optional Value");
    console.log("===============================");
    console.log(optionalValue);
  }
});


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


//  Setup all the routes we are going to use.
app.get("/", poll.showAllPolls);

app.get("/poll/create", poll.showCreatePoll);
app.post("/poll/create", urlencodedParser, poll.createPoll);

app.get("/poll/:id", poll.showPoll);
app.get("/polldata/:id", poll.sendPollData);

app.post("/poll/:id", urlencodedParser, poll.votePoll);
app.post("/poll/edit/:id", urlencodedParser, poll.editPoll);
app.post("/poll/delete/:id", poll.deletePoll);

app.get("/user", user.show);
app.get("/user/login", user.login);
app.get("/user/logout", user.logout);
app.all("/user/authorization_callback", user.authorizationCallback);


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Page not found");
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


