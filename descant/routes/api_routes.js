var express = require('express');
var router = express.Router();

// API root. Provide list of api versions here.
router.get('/', function(req, res, next) {
  //TODO!!!
  res.json({"versions": { "v0.1": "/api/v0.1" }});
});

router.use('/v0.1', require('./api_v0.1_routes'));

module.exports = router;
