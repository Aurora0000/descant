var express = require('express');
var router = express.Router();

// API root. Provide list of api versions here.
router.get('/', function(req, res, next) {
  //TODO!!!
  res.json({"versions": { "v0.1": "/api/v0.1" }});
});

// ### v0.1 API ###
router.get('/v0.1', function(req, res, next) {
  res.json({"error": "The API cannot be called directly. Please use the provided calls (available at https://github.com/Aurora0000/descant)"});
});

// # /api/v0.1/users #
router.get('/v0.1/users', function(req, res, next) {
  //TODO - Create callback in descant/api/v0.1/users.js
  res.json({"todo": "todo"})
});

router.post('/v0.1/users', function(req, res, next) {
  //TODO - Actually link to that page
  res.json({"error": "Only humans can register, please use the page there."});
});

router.put('/v0.1/users', function(req, res, next){
  res.json({"error": "Bulk-updating users via PUT isn't supported."});
});

router.delete('/v0.1/users', function(req, res, next) {
  res.json({"error": "Deleting all users would delete yourself too. Good try, hacker."})
});

// # /api/v0.1/users/:uid #
router.get('/v0.1/users/:uid', function(req, res, next) {
  // TODO - Add actual logic and callbacks
  res.json({"uid": req.params.uid});
});

router.post('/v0.1/users/:uid', function(req, res, next) {
  res.json({"error": "Use the registration API or PUT /v0.1/users/:uid to change this account."});
});

router.put('/v0.1/users/:uid', function(req, res, next) {
  res.json({"todo": "todo"});
});

router.delete('/v0.1/users/:uid', function(req, res, next) {
  res.json({"todo": "todo"});
});

// TODO: Add /threads and /posts

module.exports = router;
