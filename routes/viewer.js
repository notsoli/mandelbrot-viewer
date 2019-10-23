var express = require('express');
var router = express.Router();

/* GET viewer page. */
router.get('/', function(req, res, next) {
  res.render('viewer', { title: 'Express' });
});

module.exports = router;
