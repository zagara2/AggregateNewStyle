require("babel-register")({
	presets: ['react']
});

var express = require('express');
var app = express();

app.use(express.static("public"));
app.use(require("./routes/index.jsx"));

// DB TEST STUFF

var mongoose = require("mongoose");

var Test = require("./models/testModel.js");

var db = process.env.MONGODB_URI || "mongodb://localhost/mongoTestAggregate";

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



//END OF DB TEST STUFF 

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {

console.log('http://localhost:' + PORT);
});
