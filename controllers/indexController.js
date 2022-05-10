const BlogPost = require('../models/BlogPostModel')
const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
exports.posts_get = function (req, res, next) {
    
    console.log(req)
    BlogPost.find({})
        .exec(function (err, list_posts) {
            if (err) {return next(err); }
            //Successful, so return with JSON data of blog post
            res.json(list_posts)
        })
}

exports.posts_post = function (req, res, next) {
    const token = req.cookies.access_token
    if (!token) {
        return res.sendStatus(403);
    }
    
    jwt.verify(token, secretkey, (err, authData) => {
        if (err) {
            console.log(err)
            res.sendStatus('403');
        } 
        if (!authData.userdata.isAdmin) {
            console.log('not an admin.')
            res.sendStatus('403')
        } else {
            const blogpost = new BlogPost({
                title:req.body.title,
                author: req.body.author,
                imageURL:req.body.imageURL || null,
                text:req.body.text,
                published:req.body.published,
                comments:[]
            }).save(err => {
                if (err) {return next(err); }
                res.sendStatus(201)
            })
        }
    })

    
}

exports.posts_id_get = function(req, res, next) {
    //need to write logic on getting a single post.
}

exports.posts_id_delete = function(req, res, next) {
    //need to write logic on deleting a single post. 
}

exports.new_user = function(req, res, next) {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {return next(err); }
        const user = new User({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            username:req.body.username,
            password:hashedPassword,
            isAdmin:req.body.isAdmin
        }).save(err => {
            if (err) {return next(err); }
            res.sendStatus('201')
        })
    })
}