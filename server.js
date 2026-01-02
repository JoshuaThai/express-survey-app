// Set up server.js
const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const myData = {}; // where data for form will be stored.

// Set up SQLite database connection
const dbPath = path.resolve(__dirname, 'data', 'survey.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to the SQLite database.');
  }
});

// Create user tables (run once)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);
// Modify the responses table to have a foreign key that connects to users table
db.run(`
CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    question TEXT,
    answer TEXT,
    page_number INTEGER
);
`)


// Set up session middleware
app.use(session({
    secret: 'keyboard cat', // required: used to sign session ID cookies
    resave: false, // don’t save session if unmodified
    saveUninitialized: true, // save new sessions that haven’t been modified yet
    cookie: { 
        maxAge: 1000 * 240, // session expires after 10 seconds of inactivity (In milliseconds)
        secure: false 
    } // set to true if using HTTPS
}));

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.set('view engine', 'ejs');
// app.set("views", "./views");

const fs = require("fs");
const { error } = require('console');
// const path = require("path");

const viewsDir = path.join(__dirname, "views");

function getEjsFiles() {
  return fs.readdirSync(viewsDir)               // get all file names
           .filter(file => file.endsWith(".ejs")) // keep only .ejs
           .map(file => path.basename(file, ".ejs")); // strip .ejs
}

const ejsFiles = getEjsFiles();
console.log(ejsFiles);

// dummy username and password
// const email = "admin@outlook.com";
// const password = "password";

// Sample route handlers
// app.post('/survey', (req, res) =>{ //look at request coming from your web server
//     // req will contain infromation being sent in
//     // res will contain information being sent out by server
// });

app.get('/survey', (req, res) =>{
    if (req.session.email == null || req.session.password == null) {
        return res.redirect('/survey/login');
    }
    res.render("index");
});

// CONTINUE BY SETTING UP DATABASE TO STORE USER LOGIN/SIGNUP DETAILS
// ALL LOGIN ROUTE HANDLERS BELOW
app.get('/survey/login', (req, res) =>{
    res.render("login", {error: null});
});
// redirect /login to login page
app.get('/login', (req, res) =>{
    res.render("login", {error: null});
});

app.post('/login', (req, res) =>{
    // Loop through the whole database.
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', 
        [req.body.email, req.body.password], 
        (err, row) => {
            if (err) {
                console.error('❌ Error querying the database:', err.message);
                return res.render("signup", {error: "An error occurred. Please try again."});
            }
            if (row) {
                console.log("-------------------------");
                console.log("User email: " + row.email);
                console.log("User password: " + row.password);
                // if (req.body.email == row.email && req.body.password == row.password) {
                //     req.session.email = req.body.email;
                //     req.session.password = req.body.password;
                //     return res.redirect("/survey/1");
                // }
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                return res.redirect("/survey/1");
            } else{
                return res.render("login", {error: "Invalid email or password"});
            }
    });

    // if (req.body.email == req.session.email && req.body.password == req.session.password) {
    //     return res.redirect("/survey/1");
    // }
    
});
// ALL LOGIN ROUTE HANDLERS ABOVE

// ALL SIGNUP ROUTE HANDLERS BELOW
app.get('/survey/signup', (req, res) =>{
    res.render("signup", {error: null});
});
// redirect /signup to signup page
app.get('/signup', (req, res) =>{
    res.render("signup", {error: null});
});

app.post('/signup', (req, res) =>{
    // For simplicity, accept any signup details
    req.session.email = req.body.email;
    req.session.password = req.body.password;

    db.get('SELECT * FROM users WHERE email = ? AND password = ?', 
        [req.body.email, req.body.password], 
        (err, row) => {
            if (err) {
                console.error('❌ Error querying the database:', err.message);
                return res.render("signup", {error: "An error occurred. Please try again."});
            }
            if (row) {
                return res.render("signup", {error: "User already exists. Please log in."});
            }
            // Insert new user into the database if the user doesn't exist
            // DB call nested inside get since database calls are asynchronous
            db.run('INSERT INTO users (email, password) VALUES (?, ?)', 
                [req.body.email, req.body.password], 
                (err) => {
                    if (err) {
                        console.error('❌ Error inserting into the database:', err.message);
                        return res.render("signup", {error: "An error occurred. Please try again."});
                    }
                    console.log(`✅ New user created with ID ${this.lastID}`);
                    return res.redirect("/survey/1");
            });
        });
});
// ALL SIGNUP ROUTE HANDLERS ABOVE


// SURVEY PAGE ROUTE HANDLERS BELOW

// '/survey/' and '/survey' and '/survey/1' now point to same page.
app.get('/survey/:page', (req, res) =>{
    // console.log("INFO PAGE LOADING");
    const pageNumber = req.params.page;
    const pageList = getEjsFiles();
    // check if user is logged in
    if (req.session.email == null || req.session.password == null) {
        if(!isNaN(pageNumber) && Number(pageNumber) == 6){
            return res.render("info5", {page: pageNumber, 
                message: 
                "Thank you for showing interest in our survey! Take a look at the overall results below."});
        }
        return res.redirect('/survey/login');
    }
    // let selected = req.body.nextPage;

    // console.log("Page Number: " + pageNumber);
    // Ensure pageNumber is a number and redirect if not
    if(isNaN(pageNumber)){
        return res.render('/survey/1');
    }

    // Redirect to first or last page if out of bounds
    if (Number(pageNumber) < 1) {
         return res.redirect('/survey/1');
    }
    if (Number(pageNumber) > pageList.length) {
        // Show all information in database except sensitive information
        
         return res.render('/survey/6', );
    }
    // Redirect to login page if on page 7
    if (Number(pageNumber) == 7) {
        return res.redirect('/survey/login');
    }
    // Redirect to signup page if on page 8
    if (Number(pageNumber) == 8) {
        return res.redirect('/survey/signup', {error: null});
    }
   res.render(pageList[pageNumber - 1], {page: pageNumber, message: null, error: null});
    // res.render('info', {myData});
});

app.post('/survey/:page', (req, res) =>{
    // let selected = req.body.nextPage;
    // prevent user from continuing survey if not logged in
     if (req.session.email == null || req.session.password == null) {
        return res.redirect('/survey/login');
     }
    console.log("Survey Page being loaded.");
    const pageNumber = req.params.page;
    const pageList = getEjsFiles();

    // console.log(selected);
   if (pageNumber == "unsuccessful"){
        res.redirect('/unsuccessful.html');
        return;
   }
   res.render(pageList[pageNumber - 1], {page: pageNumber, message: null});
});



app.listen(3000);