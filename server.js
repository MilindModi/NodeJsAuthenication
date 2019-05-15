const {mongoose}  = require('./db/mongoose');
const {student} = require('./model/student');
const express = require('express');
const app  =  express();
const bodyParser = require("body-parser");
 app.use(bodyParser.json());


var studentRoutes = require('./routes/studentRoutes')
app.use('/',studentRoutes)



function add (){
  const s   = new student({
    email:'milind',
    password:123456
  })
  const result  = s.save();
}


app.listen(3000, () => {
  console.log('Starting on port 3000');
});
