require("babel-register")({
	presets: ['react']
});

var express = require('express');
var app = express();

app.use(express.static("public"));
// app.use(require("./routes/index.jsx"));



// DB TEST STUFF START
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({
  extended: false
}));

var Test = require("./models/testModel.js");

var db = process.env.MONGODB_URI || "mongodb://localhost/mongoTestAggregate3";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

//DB TEST: ROUTES

// Route to post our form submission to mongoDB via mongoose
app.post("/submit", function(req, res) {

  // We use the "Example" class we defined above to check our req.body(what the user typed in) against our user model(how we specified things have to be in order to be accepted into the database)
  //putting the user input into a format that can be saved to the database
  var user = new Test(req.body);

  // With the new "Example" object created, we can save our data to mongoose
  // Notice the different syntax. The magic happens in userModel.js
  user.save(function(error, doc) { //doc is the data to be saved
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise, send the new doc to the browser
    else {
      res.send(doc);
    }
  });
});


// Route to get all saved users
app.get("/users", function(req, res) {

  Test.find({})
    .exec(function(err, doc) {

      if (err) {
        console.log(err);
      }
      else {
        res.send(doc);
      }
    });
});


// Any non API GET routes will be directed to our React App and handled by React Router
//this goes last since routes are evaluated in order, and this is a catch all last resort route!
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


//END OF DB TEST STUFF 

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {

console.log('http://localhost:' + PORT);
});
