const  {student}  = require('../model/student');

var authenticate = (req, res, next) => {
   var token = req.header('x-auth');

   student.findByToken(token).then((user) => {

      if (!user) {
         return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
   }).catch((e) => {

      console.log('request rejected')
      res.status(401).send()
   })
}
module.exports = {authenticate}