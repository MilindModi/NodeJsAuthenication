const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/authenticate')
.then(() => console.log('connected'))
.catch(err => console.log('error :' +err))
module.exports = {mongoose}
