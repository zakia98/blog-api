var express = require('express');
const { route } = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {
  //works
  res.send('getting all posts')
});

router.post('/posts', function(req, res, next) {
  //works
  res.send('uploading a new post')
});

router.get('/posts/:id', function(req, res, next) {
  //
  res.send(`Getting the post for ID ${req.params.id} `)
})

router.delete('/posts/:id', function(req, res, next) {
  res.send(`deleting post id ${req.params.id}`)
})


module.exports = router;
