const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let BlogPostSchema = new Schema({
    title:{type:String, required:true},
    author: {type:String, required:true},
    imageURL:{type:Schema.Types.Mixed, required:false},
    text:{type:String, required:true},
    published:{type:Boolean, required:true},
    comments:[]
})


module.exports = mongoose.model('BlogPost', BlogPostSchema)









