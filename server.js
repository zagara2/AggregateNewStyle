require("babel-register")({
	presets: ['react']
});

var express = require('express');
var app = express();

app.use(express.static("public"));
app.use(require("./routes/index.jsx"));

// DB TEST STUFF

// var mongoose = require("mongoose");

// var db = process.env.MONGODB_URI || "mongodb://localhost/mongoTestAggregate";



//END OF DB TEST STUFF 

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {

console.log('http://localhost:' + PORT);
});
