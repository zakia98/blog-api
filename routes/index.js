var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretkey = process.env.SECRET_KEY

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Get all posts
router.get('/posts', indexController.posts_get);

//Create a new post
router.post('/posts', authorization, indexController.posts_post);

//Get a specific post
router.get('/posts/:id', indexController.posts_id_get)

//Delete a specific post. 
router.delete('/posts/:id', authorization, indexController.posts_id_delete)

//Create a new user
router.post('/new-user', indexController.new_user)

router.post('/login', function(req, res, next) { 
  UserModel.findOne({username:req.body.username}, (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      throw new Error('User not found')
    } else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          //passwords match! log user in. 
          console.log('success')
          const userinfo = {
            username:user.username,
            isAdmin:user.isAdmin
          };
          const token = jwt.sign({userinfo}, secretkey, {expiresIn:'10m'});
          res.cookie('access_token', token, {
            httpOnly:true,
          })
            .status(200)
            .json({message:'Logged in successfully'})
        }
      })
    }
  })
})

router.get('/protected-route', authorization, function(req, res, next) {
  if (req.isAdmin) {
    res.json({
      adminstatus:'user is admin',
      reqinfo:{
        admin:req.isAdmin,
        username:req.username
      }
    })
  } else {
    res.json({
      message:'user is not admin'
    })
  }
})

router.get('/logout', function(req, res, next) {
  return res.clearCookie('access_token')
    .status(200)
    .json({message:'Successfully logged out.'})
})



function authorization(req, res, next) {
  const token = req.cookies.access_token
  if (!token) {
    res
      .status(403)
      .json({message:'no auth token provided'})
  }
  jwt.verify(token, secretkey, (err, authData) => {
    if (err) {
        console.log(err)
        res.sendStatus('403');
    } 
    try {
      const data = jwt.verify(token, secretkey);
      console.log(data)
      req.username = data.userinfo.username
      req.isAdmin = data.userinfo.isAdmin
      return next()
    } catch {
      return res.sendStatus(403)
    }
  })
}


module.exports = router;
