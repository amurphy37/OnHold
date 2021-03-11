const express = require('express');
const morgan = require('morgan');
const session = require("express-session")
const cookieParser = require("cookie-parser")


// Setting up our express app and setting up port for local and heroku hosted

const inProductionEnvironment = process.env.NODE_ENV === "production"

const app = express()
const PORT = process.env.PORT || 8080


// Setting Mongoose options to be passed as callback in our mongoose connect function. 

// let options = {}

// let connectionString

// if (inProductionEnvironment) {

//     var username
//     var password
//     var hosts 
//     var database 
//     options
//     connectionString = 'mongodb://' + username + ':' + password + '@' + hosts + '/' + database + options;

//     // Connecting Mongoose and displaying in console that it's connected on success
//     mongoose.connect(connectionString, function (err, db) {
//         if (err) {
//             console.log('Error: ', err);
//         } else {
//             console.log('Connected!');
//         }
//     })
// }

// else {
//     // Setting our Mongo URI dynamically based on whether we're hosting locally or on Heroku. 
//     connectionString = 'mongodb://localhost:27017/smartrecruiters_app'

//     options = {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         family: 4
//     }

//     // Connecting Mongoose and displaying in console that it's connected on success
//     mongoose.connect(connectionString, options)
// }

// const db = mongoose.connection

// db.on("error", console.error.bind(console, "Connection Error: "))

// db.once("open", function () {
//     console.log("Successfully connected to MongoDb!")
// })

// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting up cookie-parser to have cookies included in requests

app.use(cookieParser())

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: true }));
app.use((req, res, next) => {
    console.log("req.session", req.session);

    next()
});

app.use(passport.initialize());
app.use(passport.session());

// Accessing our routes

const routes = require("./routes/api")

app.use("/api", routes)

// HTTP request logger
app.use(morgan('tiny'));

// // Production Mode
// if (inProductionEnvironment) {
//     app.use(express.static('client/build'))

//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "/client/build/index.html"))
//     })
// }

// Tell the user which port app is running on when successfully up and running.
app.listen(PORT, console.log(`Server is starting at ${PORT}`))