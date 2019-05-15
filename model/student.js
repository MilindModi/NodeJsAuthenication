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
  }
})
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
      return Promise.resolve(student);
    }
  });


}
studentSchema.methods.generateAuthToken = function () {
  var student = this;
  var access = 'auth';
  var token = jwt.sign({_id: admin._id.toHexString(), access},'abc123').toString();

  admin.tokens = admin.tokens.concat([{access, token}]);

  return admin.save().then(() => {
    return token;
  });
};

const student  = mongoose.model('student',studentSchema)

module.exports = {student};
