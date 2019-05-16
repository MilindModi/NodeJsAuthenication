const express = require('express');

const studentRoutes = express.Router();
const { student } = require('../model/student')
const { authenticate } = require('../middleware/authenticate')
studentRoutes.get('/student', (req, res) => {
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
})
studentRoutes.post('/add-student', (req, res) => {
  console.log('student request');

  console.log('email : ' + req.body.Email);
  console.log('password : ' + req.body.Password);
  const st = new student({
    Email: req.body.Email,
    Password: req.body.Password
  })
  st.generateAuthToken()
    .then((token) => {
      const result = st.save();
      res.header('x-auth', token).send({ st, token })
    })
    .catch((e) => {
      console.log("generateAuthToken Error." + e);
      res.status(400).send();
    });



})


studentRoutes.post('/student-login', (req, res) => {

  student.findByCredentials(req.body.Email)
    .then((student) => {
      console.log('student login');
      if (student.Password == req.body.Password) {
        console.log("generateAuthToken");
        student.generateAuthToken()
          .then((token) => {
            res.header('x-auth', token).send({ student, token })
          })
          .catch((e) => {
            console.log("generateAuthToken Error." + e);
            res.status(400).send();
          });

      } else {
        res.status(400).send("Login failed");
      }
    }).catch((e) => {
      console.log("Error." + e);
      res.status(400).send("Login failed");
    });
})
studentRoutes.post('/student-me', authenticate, (req, res) => {
  console.log('student-me ' + req.user)
  res.send(req.user);
})
studentRoutes.delete('/student/me', authenticate, (req, res) => {
  console.log('logging out');
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });

})
module.exports = studentRoutes;
