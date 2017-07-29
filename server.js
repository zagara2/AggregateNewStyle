require("babel-register")({
    presets: ['react']
});

var express = require('express');
var session = require('express-session');
var app = express();

//from express session tutorial
// app.set('public', __dirname + '/public');
//app.engine('html', require('ejs').renderFile);
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

var sess;
//


app.use(express.static("public"));
// app.use(require("./routes/index.jsx"));



// DB TEST STUFF START
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({
    extended: true //changed to "true" because of express session tutorial 
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
            } else {
                res.send(doc);
            }
        });
});

//END OF DB TEST STUFF 

//START OF EXPRESS SESSION TUTORIAL ROUTE STUFF

app.get('/', function(req, res) {
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.email) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        res.redirect('/admin');
    } else {
        res.sendFile(__dirname + './public/index.html');
    }
});

app.post('/login', function(req, res) {
    console.log(req.body);
    //check if user's email is in the db
    //or rather, check if there is a db entry that matches both the entered email and pword

    Test.find({ $and: [{ email: req.body.email }, { password: req.body.pass }] })
        .exec(function(err, doc) {

            if (err) {
                console.log(err);
            } else if (!doc.length) { //if no entry found that matches both 
                console.log("email/password mismatch");
                flash = {
                    "msg": "Email/password mismatch! Try again.",
                    "level": "warning"
                };
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(flash));

                // alert("email/password mismatch! try again");
            } else {
                // res.send(doc);
                sess = req.session;
                //In this we are assigning email to sess.email variable.
                //email comes from HTML page.
                sess.email = req.body.email;
                res.end('done');
            }
        });



});

app.get('/admin', function(req, res) {
    sess = req.session;
    if (sess.email) {
        // res.write('<h1>Hello ' + sess.email + '</h1>');
        // res.end('<a href="/logout">Logout</a>');
        res.sendFile(__dirname + '/public/adminLanding.html');
    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});



//END OF EXPRESS TUTORIAL ROUTE STUFF


//Routes for board creation

var Board = require("./models/boardModel.js");

// Route to post our form submission to mongoDB via mongoose
app.post("/submitBoard", function(req, res) {

	// console.log(req.body);

	 sess = req.session;
	 if (sess.email) {
    

        var newBoard = {
            boardname: req.body.boardname,
            description: req.body.description,
            owner: sess.email,
            imageLink: req.body.imageLink,
            dataSourceIDs: []

        };

        // console.log(newBoard);

        // Save the new board we made to mongoDB with mongoose's save function
        Board.create(newBoard, function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Or just log the doc we saved
            else {
                // console.log(doc);
                res.send(doc);
                // Place the log back in this callback function
                // so it can be used with other functions asynchronously
                // cb(doc);
            }
        });

    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }


});


// Route to get all of a user's boards
app.get("/myBoards", function(req, res) {

    sess = req.session;

    if (sess.email) {

        Board.find({ owner: sess.email })
            .exec(function(err, doc) {

                if (err) {
                    console.log(err);
                } else {
                    res.send(doc);
                }
            });


    } else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});




//end of routes for board creation


// Any non API GET routes will be directed to our React App and handled by React Router
//this goes last since routes are evaluated in order, and this is a catch all last resort route!
app.get("*", function(req, res) {
    // res.sendFile(__dirname + "/public/index.html");
    res.redirect("/");
});




var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {

    console.log('http://localhost:' + PORT);
});