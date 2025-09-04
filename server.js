// Set up server.js

const express = require('express');
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');
// app.set("views", "./views");

app.get('/', (req, res) =>{
    console.log("Yes");
    res.render("index");
})

app.post('/', (req, res) =>{
    // req will contain infromation being sent in
    // res will contain information being sent out by server
    let selected = req.body.submitButton;
    if (selected == "Exit"){
        res.redirect("/unsuccessful.html"); // redirect user to unsuccessful page.
    } else{
        res.render("info");
    }
})

app.listen(3000);