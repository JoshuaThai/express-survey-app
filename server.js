// Set up server.js

const express = require('express');
const app = express();

app.use(express.urlencoded({extended : true}));

app.set('view engine', 'ejs');

app.listen(3000);