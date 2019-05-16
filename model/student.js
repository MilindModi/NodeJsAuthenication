const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const studentSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})
studentSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();
  return _.pick(userObj,['_id','Email'])
}
studentSchema.methods.generateAuthToken = function () {
  var student = this;
  var access = 'auth';
  var token = jwt.sign({ _id: student._id.toString(), access }, 'abc123').toString();

  student.tokens = student.tokens.concat([{ access, token }]);
  console.log(token)


  return student.save().then(() => {
    return (token);
  });
};

studentSchema.methods.removeToken = function (token){
  var student = this;
  console.log('updated');
  return student.updateOne({
    $pull:{
      tokens:{token}
      }
    })
}

studentSchema.statics.findByCredentials = function (Email) {
  var student = this;
  console.log(Email);
  return student.findOne({ Email })
    .then((student) => {
      if (!student) {
        console.log('rejected');
        return Promise.reject();
      } else {
        console.log(student);
        // student.generateAuthToken();
        return Promise.resolve(student);
      }
    });
}

studentSchema.statics.findByToken = function (token) {
  console.log(token)

  var student = this;
  var decoded;

  try {
    console.log('verifying ' + token)

    decoded = jwt.verify(token, 'abc123');
    console.log('decoded '+decoded)
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    console.log('rejected')
    return Promise.reject();
  }

   var st = student.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
  console.log('returned '+st)
  return Promise.resolve(st);

};

const student = mongoose.model('student', studentSchema)

module.exports = { student };
