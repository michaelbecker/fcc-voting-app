const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Pull this from our hidden env file.
const mongoDbUrl = process.env.MLAB_URI;


exports.init = function() {

  // If something goes wrong, let's find out.
  mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
  });
  
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
  });
  
  // Set up our callbacks for when the connection is opened.
  mongoose.connection.on('open', function() {
    
    console.log('Mongoose connected.');
    
    // Now that we are connected, make sure 
    // we clean up after ourselves when we die.
    process.on('SIGINT', function() {
      
      mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
      });
    
    });
  });
  
  // Finally let's actually connect!
  mongoose.connect(mongoDbUrl);
};


// Define the schemas for this application.
const UserSchema = new Schema({
  login: { type: String, required: true },
  name:  { type: String, required: true },
  polls: [{
    id: { type: ObjectId, required: true }
  }]
});

const PollSchema = new Schema({
  owner:   { type: ObjectId, required: true },
  name:    { type: String, required: true },
  options: [{
    name: { type: String, required: true },
    votes: { type: Number, default: 0 }
  }]
});


PollSchema.statics.getAll = function (callback) {
  
  Poll.find( {}, "name", function(err, polls) {
    callback(err, polls);
  });
};


PollSchema.statics.getPollFromId = function (Id, callback) {
  
  Poll.findById( {_id: Id}, function(err, poll) {
    callback(err, poll);
  });
}


// This votes up an existing option, or creates a new one.
PollSchema.statics.vote = function (Id, optionName, callback) {

  Poll.findById( {_id: Id}, function(err, poll) {
  
    if (err) throw err;
    
    for (var i = 0; i < poll.options.length; i++) {
      if (poll.options[i].name == optionName){
        poll.options[i].votes++;
        poll.save(callback);
        break;
      }
    }
    
    if (i == poll.options.length) {
      var newOption = {name: optionName, votes: 1};
      poll.options.push(newOption);
      poll.save(callback);
    }
    
  });
}


UserSchema.statics.getIdFromLogin = function(login, callback) {
  User.findOne({login: login}, function(err, user) {
    callback(err, user._id);
  });
}


// Define the models for this application.
var User = mongoose.model('User', UserSchema);
var Poll = mongoose.model('Poll', PollSchema);

// And let's export them.
exports.User = User;
exports.Poll = Poll;


exports.getPollsFromLogin = function (session, callback) {
  
  User.findOne({login: session.login}, function(err, user) {
    
    // This is a new user
    if (!user) {

      User.create({login: session.login, 
                   name: session.name},
                 function(err, user) {
        callback(null);
      });
    
    }
    // Else we are just looking them up
    else {
      Poll.find({owner: user._id}, function(err, polls) {
        callback(polls);
      });
    }
  });
}


exports.getPollsFromName = function (name, callback) {
  Poll.find( {name: name}, function(err, poll) {
    if (err) throw err;
    callback(poll);
  });
}



////////////////////////////////////////////////////////////////////////
//
//  DEBUG / TEST CODE
//
////////////////////////////////////////////////////////////////////////
exports.test = function() {

  makeTestData();
  
  exports.getPollsFromName("Fav Songs", function(polls) {
    console.log("getPollsFromName: " + polls);
  });

  exports.getPollsFromName("Fav Songs2", function(polls) {
    console.log("getPollsFromName2: " + polls);
  });
  
};


function makeTestData() {

  var alice = new User({login: "alice123", name: "Alice"});
  alice.save();

  var bob = new User({login: "pizzagod", name: "Bob"});
  bob.save();

  var poll_bob1 = new Poll(
    {owner: bob.id,
     name: "Toppings!",
     options: [{name: "pepperoni", votes: 12}, 
               {name: "mushrooms", votes: 15}]}
  ).save(  function (err, product, numAffected) {
    if (err) throw err;
  });
  
  var poll_bob2 = new Poll(
    {owner: bob.id,
     name: "Fav Songs",
     options: [{name: "Banana Song", votes: 123},
               {name: "Lime in the coconut", votes: 56}]}
  ).save(  function (err, product, numAffected) {
    if (err) throw err;
  });
  
  var poll_alice1 = new Poll(
    {owner: alice.id,
     name: "Favorite Monsters",
     options: [{name: "dracula", votes: 2}, 
               {name: "frankstein", votes: 1}]}
  ).save(  function (err, product, numAffected) {
    if (err) throw err;
  });
}

