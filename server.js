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
    password TEXT,
    completed INTEGER DEFAULT 0
  )
`);
// Modify the responses table to have a foreign key that connects to users table
db.run(`
CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    question TEXT,
    answer TEXT
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

// test username and password
// email: joshua@outlook.com
// password: 123

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

// helper function for data analysis
function findMostFrequent(arr) {
  if (arr.length === 0) return null;

  // Step 1: Count occurrences
  const frequencyMap = arr.reduce((acc, val) => {
    acc.set(val, (acc.get(val) || 0) + 1);
    return acc;
  }, new Map()); // Start with an empty Map as the accumulator

  // Step 2: Find the entry with the highest count
  let maxCount = 0;
  let mostFrequentValue = null;

  for (const [value, count] of frequencyMap.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentValue = value;
    }
  }

  return mostFrequentValue;
}

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
       // Show responses from all users
        return db.all(
            "SELECT question, answer FROM responses WHERE user_email = ? ORDER BY id ASC",
            [req.session.email],
            (err, rows) => {
                if (err) {
                console.error("❌ Error querying responses:", err.message);
                return res.render(pageList[3], 
                    { page: pageNumber, message: null, error: "DB error", responses: [] });
                }

                console.log("✅ Loaded responses:", rows);
                let age = [];
                let hours = [];
                let gameDev = [];
                rows.forEach(row => {
                    if (row.question == "ageBegan") {
                        if (Number(row.answer) != NaN){
                            age.push(row.answer);
                        }
                    }
                    if (row.question == "hoursPlayed") {
                        if (Number(row.answer) != NaN){
                            hours.push(row.answer);
                        }
                    }
                    if (row.question == "gameDev") {
                        gameDev.push(row.answer);
                    }
                });
                // console.log(age);

                let mostCommonAge = findMostFrequent(age);
                console.log("Most common age:", mostCommonAge);

                let mostCommonHours = findMostFrequent(hours);
                console.log("Most common hours played:", mostCommonHours);

                let mostCommonGameDev = findMostFrequent(gameDev);
                console.log("Most common game development response:", mostCommonGameDev);
                
                return res.render(pageList[3], 
                    { page: pageNumber, message: null, error: null, 
                        mostCommonAge: mostCommonAge, 
                        mostCommonHours: mostCommonHours, 
                        mostCommonGameDev: mostCommonGameDev });
            }
            );
    }

    if (Number(pageNumber) === 4) {
        return db.all(
        "SELECT question, answer FROM responses WHERE user_email = ? ORDER BY id ASC",
        [req.session.email],
        (err, rows) => {
            if (err) {
            console.error("❌ Error querying responses:", err.message);
            return res.render(pageList[pageNumber - 1], 
                { page: pageNumber, message: null, error: "DB error", responses: [] });
            }

            console.log("✅ Loaded responses:", rows);
                let age = [];
                let hours = [];
                let gameDev = [];
                rows.forEach(row => {
                    if (row.question == "ageBegan") {
                        if (Number(row.answer) != NaN){
                            age.push(row.answer);
                        }
                    }
                    if (row.question == "hoursPlayed") {
                        if (Number(row.answer) != NaN){
                            hours.push(row.answer);
                        }
                    }
                    if (row.question == "gameDev") {
                        gameDev.push(row.answer);
                    }
                });
                // console.log(age);

                let mostCommonAge = findMostFrequent(age);
                console.log("Most common age:", mostCommonAge);

                let mostCommonHours = findMostFrequent(hours);
                console.log("Most common hours played:", mostCommonHours);

                let mostCommonGameDev = findMostFrequent(gameDev);
                console.log("Most common game development response:", mostCommonGameDev);
            
            return res.render(pageList[pageNumber - 1], 
                { page: pageNumber, message: null, error: null, mostCommonAge: mostCommonAge, 
                    mostCommonHours: mostCommonHours, 
                    mostCommonGameDev: mostCommonGameDev });
        }
        );
  }

    // Redirect to login page if on page 7
    if (Number(pageNumber) == 5) {
        return res.redirect('/survey/login');
    }
    // Redirect to signup page if on page 8
    if (Number(pageNumber) == 6) {
        return res.redirect('/survey/signup', {error: null});
    }


   res.render(pageList[pageNumber - 1], {page: pageNumber, message: null, error: null, mostCommonAge: null});
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

   if (pageNumber == 4) {
    const hoursPlayed = req.body.hoursPlayed;
    const ageBegan = req.body.ageBegan;
    const gameDev = req.body.gameDev;

    const email = req.session.email;
    console.log("EMAIL AT RESPONSES PAGE:", email);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const sql = "INSERT INTO responses (user_email, question, answer) VALUES (?, ?, ?)";
        const paramsList = [
        [email, "hoursPlayed", hoursPlayed],
        [email, "ageBegan", ageBegan],
        [email, "gameDev", gameDev],
        ];

        let remaining = paramsList.length;
        let failed = false;

        paramsList.forEach((params) => {
        db.run(sql, params, (err) => {
            if (failed) return;

            if (err) {
            failed = true;
            console.error("❌ Error inserting:", err.message);
            return db.run("ROLLBACK", () => {
                return res.render("survey/3", { error: "An error occurred. Please try again.", responses: [] });
            });
            }

            remaining -= 1;

            // ✅ commit only after last insert finishes
            if (remaining === 0) {
            db.run("COMMIT", (err) => {
                if (err) {
                console.error("❌ Error committing:", err.message);
                return db.run("ROLLBACK", () => {
                    return res.render("survey/3", { error: "An error occurred. Please try again.", responses: [] });
                });
                }

                console.log("✅ All data saved for:", email);
                return res.redirect("/survey/4");
            });
            }
        });
        });
    });

    return; // prevent the bottom res.render from running
}
   res.render(pageList[pageNumber - 1], {page: pageNumber, message: null, responses: []});
});



app.listen(3000);