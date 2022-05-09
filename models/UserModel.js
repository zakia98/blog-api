const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    first_name:{type:String, required:true},
    last_name: {type:String, required:true},
    password:{type:String, required:false},
    isAdmin:{type:Boolean, required:false}
})


module.exports = mongoose.model('User', UserSchema)









