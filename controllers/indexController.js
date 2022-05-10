const BlogPost = require('../models/BlogPostModel')
const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')
exports.posts_get = function (req, res, next) {
    
    BlogPost.find({})
        .exec(function (err, list_posts) {
            if (err) {return next(err); }
            //Successful, so return with JSON data of blog post
            res.json(list_posts)
        })
}

exports.posts_post = function (req, res, next) {
    if (!req.isAdmin) {
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

}

exports.posts_id_get = function(req, res, next) {
    BlogPost.findById(req.params.id)
        .exec(function(err, post) {
            if (err) {return next(err) ;}
            //Successful, so we return with JSON data of blog post. 
            res.json(post)
        })
}

exports.posts_id_delete = function(req, res, next) {
    console.log(req.isAdmin)
    if (!req.isAdmin) {
        res.sendStatus(403)
    } else {
        BlogPost.findByIdAndRemove(req.params.id)
        .exec(function(err, post) {
            if (err) {return next(err) ;}
            //Successful, so we return with JSON data of blog post. 
            res.sendStatus(204)
        })
    }
    

}

exports.new_user = function(req, res, next) {
    if (req.body.admin_key === process.env.ADMIN_KEY) {
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
    } else {
        res.status(403)
            .json({
                message:'Admin key incorrect. New user creation forbidden.'
            })
    }
    
}