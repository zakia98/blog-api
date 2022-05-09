const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let BlogPostSchema = new Schema({
    title:{type:String, required:true},
    author: {type:String, required:true},
    imageURL:{type:String, required:false},
    textContent:{type:Boolean, required:true},
    comments:[]
})


module.exports = mongoose.model('BlogPost', BlogPostSchema)









