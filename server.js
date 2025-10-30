// Set up server.js
const express = require('express');
const app = express();

const myData = {}; // where data for form will be stored.

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.set('view engine', 'ejs');
// app.set("views", "./views");

const fs = require("fs");
const path = require("path");

const viewsDir = path.join(__dirname, "views");

function getEjsFiles() {
  return fs.readdirSync(viewsDir)               // get all file names
           .filter(file => file.endsWith(".ejs")) // keep only .ejs
           .map(file => path.basename(file, ".ejs")); // strip .ejs
}

const ejsFiles = getEjsFiles();
console.log(ejsFiles);


app.get('/survey', (req, res) =>{
    console.log("Yes");
    // load data into form.
    // mainModule.loadData(myData);
    // res.render("index");
    res.render("index");
});

// app.post('/survey', (req, res) =>{ //look at request coming from your web server
//     // req will contain infromation being sent in
//     // res will contain information being sent out by server
//     let selected = req.body.nextPage;
//     print("Selected Page: " + selected);
//     res.render(selected);
// });

// '/survey/' and '/survey' and '/survey/1' now point to same page.
app.get('/survey/:page', (req, res) =>{
    console.log("INFO PAGE LOADING");
    // let selected = req.body.nextPage;
    const pageNumber = req.params.page;
    const pageList = getEjsFiles();
    // console.log(selected);
    // Ensure pageNumber is a number and redirect if not
    if(isNaN(pageNumber)){
        res.redirect('/survey/1');
    }

    // Redirect to first or last page if out of bounds
    if (pageNumber < 1) {
         res.redirect('/survey/1');
    }
    if (pageNumber > pageList.length) {
         res.redirect('/survey/6');
    }
   res.render(pageList[pageNumber - 1], {page: pageNumber});
    // res.render('info', {myData});
});

app.post('/survey/:page', (req, res) =>{
    // let selected = req.body.nextPage;
    console.log("Survey Page being loaded.");
    const pageNumber = req.params.page;
    const pageList = getEjsFiles();
    // console.log(selected);
   if (pageNumber == "unsuccessful"){
        res.redirect('/unsuccessful.html');
        return;
   }
   res.render(pageList[pageNumber - 1], {page: pageNumber});
})



app.listen(3000);