const {mongoose}  = require('./db/mongoose');
const {student} = require('./model/student');
const express = require('express');
const app  =  express();
const bodyParser = require("body-parser");
 app.use(bodyParser.json());

 //firebase server
var admin = require("firebase-admin");

var serviceAccount = require("./db/google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://auth-cb464.firebaseio.com"
});


var studentRoutes = require('./routes/studentRoutes')
app.use('/',studentRoutes)

app.post('/send',(req,res)=>{
  var registrationToken = 'token from app';

  const messages = [];
  messages.push({
    notification: { title: 'Message sent via node.js', body: 'Hello this is body ' },
    token: registrationToken,
  });

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendAll(messages)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

})

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
