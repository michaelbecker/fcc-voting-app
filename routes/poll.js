const db = require("../model/database.js");


// Helper function
function isLoggedIn(session) {

  if (session && session.access_token && session.login) {
    return true;
  }
  else {
    return false;
  }
}


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  GET /
//
// Initial landing page
//
//////////////////////////////////////////////////////////////////////////////
exports.showAllPolls = function(req, res) {
  
  db.Poll.getAll(function(err, polls) {
    res.render('show_all_polls', {polls: polls,
                                 session: req.session,
                                 loggedin: isLoggedIn(req.session) 
                                 });
  });
}


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  GET /poll/:id
//
//////////////////////////////////////////////////////////////////////////////
exports.showPoll = function(req, res) {

  db.Poll.getPollFromId(req.params.id, function(err, poll) {

    if (err) throw err;
    
    res.render("view_poll", {poll: poll,
                             session: req.session,
                             loggedin: isLoggedIn(req.session) 
                            });
  });

};


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  GET /polldata/:id
//
//  Needed to support d3 graphing. We actually generate the chart using 
//  the client. This route allows us to return the raw data in JSON 
//  format for d3 to use.
//
//////////////////////////////////////////////////////////////////////////////
exports.sendPollData = function(req, res) {

  db.Poll.getPollFromId(req.params.id, function(err, poll) {

    if (err) throw err;
    
    res.json({pollOptions: poll.options});
  });

};


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  POST /poll/:id
//  
//////////////////////////////////////////////////////////////////////////////
exports.votePoll = function(req, res) {

  db.Poll.vote(req.params.id, req.body.optionName, function(err, poll) {
    res.redirect("/poll/" + req.params.id);
  });
  
};


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  POST /poll/edit/:id
//  
//////////////////////////////////////////////////////////////////////////////
exports.editPoll = function(req, res) {
  
  db.Poll.vote(req.params.id, req.body.newOptionName, function(err, poll) {
    res.redirect("/poll/" + req.params.id);
  });

};


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  GET /poll/create
//
//////////////////////////////////////////////////////////////////////////////
exports.showCreatePoll = function(req, res) {

  res.render("create_poll", {session: req.session,
                             loggedin: isLoggedIn(req.session) 
                          });
};


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  POST /poll/create
//
//////////////////////////////////////////////////////////////////////////////
exports.createPoll = function(req, res) {

  console.log("createPoll pollTitle: " + req.body.pollTitle);
  console.log("createPoll optionsInput: " + req.body.optionsInput);
  
  var options = req.body.optionsInput.split(/\n+/);
  for (var i = 0; i < options.length; i++){
    options[i] = options[i].trim();
  }
  
  var filteredOptions = options.filter( function(element) {
    if (element)
      return true;
    else
      return false;
  });

  var dbOptions = [];
  for (i = 0; i < filteredOptions.length; i++) {
    dbOptions.push({ name: filteredOptions[i],
                     votes: 0});
  }
  
  db.User.getIdFromLogin(req.session.login, function(err, id) {
    
    // TODO - something smart here...
    //if (err) throw err;
    
    db.Poll.create({ owner: id,
                     name: req.body.pollTitle,
                     options: dbOptions}, 
      function(err, poll) {
        // TODO - something smart here...
        if (err) 
          throw err;
        console.log("poll " + poll.name + " " + poll._id + "saved!");
        res.redirect("/user");
      });
  });
  
};


//////////////////////////////////////////////////////////////////////////////
// 
//  ROUTE:  POST /poll/delete/:id
//  
//  We'll overload POST since browser support for DELETE is spotty at best. 
//////////////////////////////////////////////////////////////////////////////
exports.deletePoll = function(req, res) {
  
  console.log("Requested to delete Poll id " + req.params.id);
  
  db.Poll.findByIdAndRemove(req.params.id, function(err, poll) {
    
    if (err) throw err;
    
    res.redirect("/user");
  });
};

