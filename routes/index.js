var express = require('express');
const { route } = require('../app');
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

router.get('/posts', indexController.posts_get);

router.post('/posts', verifyToken, indexController.posts_post);

router.get('/posts/:id', indexController.posts_id_get)

router.delete('/posts/:id', indexController.posts_id_delete)

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
  }
})

router.get('/logout', function(req, res, next) {
  return res.clearCookie('access_token')
    .status(200)
    .json({message:'Successfully logged out.'})
})

function verifyToken(req, res, next) {
  //Get auth header value.
  const bearerHeader = req.headers['authorization'];
  //Check to see if bearer is undefined. 
  if (typeof bearerHeader !== 'undefined') {
    //Split at the space
    bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    //set the token.
    req.token = bearerToken;
    next()
  } else {
    // Forbidden
    res.sendStatus('403')
  }
}

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
      req.username = data.userinfo.username
      req.isAdmin = data.userinfo.isAdmin
      return next()
    } catch {
      return res.sendStatus(403)
    }
  })
}


module.exports = router;
