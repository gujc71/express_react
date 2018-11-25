var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

router.post('/', function(req, res, next) {
	const token = jwt.sign({
		usersq: req.body.params.userid
	}, 'secret', { expiresIn: 60 * 60 });
  	res.json({token: token});
});

module.exports = router;
