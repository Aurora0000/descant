var express = require('express');
var router = express.Router({mergeParams: true});
var account = require('../models/api/v0.1/user');

// ### v0.1 API ###
router.get('/', function(req, res, next) {
  res.json({"error": "The API cannot be called directly. Please use the provided calls (available at https://github.com/Aurora0000/descant)"});
});

// # /api/v0.1/users #
router.get('/users', function(req, res, next) {
  //TODO - Create callback in descant/api/v0.1/users.js
  res.json({"todo": "todo"})
});

router.post('/users', function(req, res, next) {
  //TODO - Actually link to that page
  res.json({"error": "Only humans can register, please use the page there."});
});

router.put('/users', function(req, res, next){
  res.json({"error": "Bulk-updating users via PUT isn't supported."});
});

router.delete('/users', function(req, res, next) {
  res.json({"error": "Deleting all users would delete yourself too. Good try, hacker."})
});

// # /api/v0.1/users/:uid #
router.get('/users/:uid', function(req, res, next) {
  // TODO - Add actual logic and callbacks
  res.json({"uid": req.params.uid});
});

router.post('/users/:uid', function(req, res, next) {
  res.json({"error": "Use the registration API or PUT /v0.1/users/:uid to change this account."});
});

router.put('/users/:uid', function(req, res, next) {
  res.json({"todo": "todo"});
});

router.delete('/users/:uid', function(req, res, next) {
  res.json({"todo": "todo"});
});

router.post('/register', function(req, res, next){
  if (req.body.password == null || req.body.username == null || req.body.email == null) {
    res.json({"error": "Username or password not provided!"});
  }
  // TODO: Verify email here.
});

//TODO: Add posts and threads calls.

module.exports = router;
