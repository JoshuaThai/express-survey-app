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

app.post('/survey', (req, res) =>{ //look at request coming from your web server
    // req will contain infromation being sent in
    // res will contain information being sent out by server
    // const formData = req.body; // Access form data from req.body
    // console.log('Received form data:', formData);
    
    // // save data in pseudo server-side data storage.
    // for(const key in formData){
    //     if (key == "nextPage" || key == "submitButton"){continue}
    //     // console.log(key,"-", formData[key]);
    //     myData[key] = formData[key];
    // }
    let selected = req.body.nextPage;
    // let indexSelected = req.body.submitButton; // if user failed survey right away
    // if (indexSelected == "Exit"){
    //     res.redirect("/unsuccessful.html"); // redirect user to unsuccessful page.
    //     return
    // }
    // // console.log(otherSelection);
    // console.log(selected);
    // if (selected == "Exit"){
    //     res.redirect("/unsuccessful.html"); // redirect user to unsuccessful page.
    // } else{
    //     res.render(selected, {myData});
    // }
    res.render(selected);
});

// '/survey/' and '/survey' and '/survey/1' now point to same page.
app.get('/survey/:page', (req, res) =>{
    console.log("INFO PAGE LOADING");
    // let selected = req.body.nextPage;
    const pageNumber = req.params.page;
    const pageList = getEjsFiles();
    // console.log(selected);
//    if (params == "unsuccessful"){
//     res.redirect('/unsuccessful.html');
//    }
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