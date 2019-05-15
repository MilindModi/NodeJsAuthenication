const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
  Email:{
    type:String,
    required:true
  },
  Password:{
    type:String ,
    required:true
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
})
studentSchema.methods.generateAuthToken = function () {
  var student = this;
  var access = 'auth';
  var token = jwt.sign({_id: student._id.toString(), access},'abc123').toString();

  student.tokens = student.tokens.concat([{access, token}]);
  console.log(token)


  return student.save().then(() => {
    return (token);
  });
};
studentSchema.statics.findByCredentials =  function (Email){
  var student = this;
  console.log(Email);
  return student.findOne({Email})
  .then((student) => {
    if (!student) {
      console.log('rejected');
        return Promise.reject();
    }else{
      console.log(student);
      // student.generateAuthToken();
      return Promise.resolve(student);
    }
  });


}


const student  = mongoose.model('student',studentSchema)

module.exports = {student};
