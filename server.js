// Set up server.js
const express = require('express');
const app = express();

const myData = {}; // where data for form will be stored.

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');
// app.set("views", "./views");

app.get('/', (req, res) =>{
    console.log("Yes");
    // load data into form.
    // mainModule.loadData(myData);
    // res.render("index");
    res.render("index", {myData});
});

app.post('/', (req, res) =>{ //look at request coming from your web server
    // req will contain infromation being sent in
    // res will contain information being sent out by server
    const formData = req.body; // Access form data from req.body
    console.log('Received form data:', formData);
    
    // save data in pseudo server-side data storage.
    for(const key in formData){
        if (key == "nextPage" || key == "submitButton"){continue}
        // console.log(key,"-", formData[key]);
        myData[key] = formData[key];
    }
    let selected = req.body.nextPage;
    let indexSelected = req.body.submitButton; // if user failed survey right away
    if (indexSelected == "Exit"){
        res.redirect("/unsuccessful.html"); // redirect user to unsuccessful page.
        return
    }
    // console.log(otherSelection);
    console.log(selected);
    if (selected == "Exit"){
        res.redirect("/unsuccessful.html"); // redirect user to unsuccessful page.
    } else{
        res.render(selected, {myData});
    }
});

app.post('/info', (req, res) =>{
    console.log("INFO PAGE LOADING");
    return res.render('info', {myData});
});



app.listen(3000);