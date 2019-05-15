const express = require('express');

const studentRoutes = express.Router();
const {student} = require('../model/student')

studentRoutes.get('/student',(req,res) =>{
  console.log('student request');

  var result = student.find({})
  .then(
    result => {
      res.send(result);
    },
    e => {
      res.status(400).send(e);
    }
  );
;
} )
studentRoutes.post('/add-student',(req,res) =>{
  console.log('student request');

  console.log('email : '+req.body.Email);
  console.log('password : '+req.body.Password);

  const s   = new student({
    Email:req.body.Email,
    Password:req.body.Password
  })
  const result  = s.save();
  res.send('user saved');
} )


studentRoutes.post('/student-login',  (req,res) =>{

    student.findByCredentials(req.body.Email)
    .then((student) => {
        console.log('student login');
        if(student.Password == req.body.Password){
          console.log("generateAuthToken");
          student.generateAuthToken()
          .then((token) => {
          })
          .catch((e) => {
            console.log("generateAuthToken Error." + e);
            res.status(400).send();
          });

          res.send(student)
        }else{
          res.status(400).send("Login failed");
        }
      }).catch((e) => {
          console.log("Error." + e);
          res.status(400).send("Login failed");
        });
})
module.exports = studentRoutes;
