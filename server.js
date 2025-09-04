// Set up server.js

const express = require('express');
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');
app.set("views", "./views");

app.get('/', (req, res) =>{
    console.log("Yes");
    res.render("index");
})

app.listen(3000);