var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var maxNo = 3;
var board_data = [
	{
		brdno: 1,
		brdwriter: 'Lee SunSin',
		brdtitle: 'If you intend to live then you die',
		brddate: new Date()
	},
	{
			brdno: 2,
			brdwriter: 'So SiNo',
			brdtitle: 'Founder for two countries',
			brddate: new Date()
	}   	
];

router.get('/', verifyToken, function(req, res, next) {
  res.json(board_data);
});

router.delete('/', verifyToken, function(req, res, next) {
	const brdno = parseInt(req.query.brdno);
	board_data = board_data.filter(row => row.brdno !== brdno)

  res.json({"result": "OK"});
});

router.post('/', verifyToken, function(req, res, next) {
	let newData = req.body.params;
	
	if (newData.brdno) {                                               // Update
		board_data = board_data.map(row => newData.brdno === row.brdno ? {...newData }: row);
	} else {                                                           // new : Insert
		newData = {...newData, brddate: new Date(), brdno: maxNo++ };
		let newboards = [newData];
		board_data = newboards.concat(board_data);
	}    
	console.log(newData);

  res.json(newData);
});

function verifyToken(req, res, next) {
	let auth = req.headers['authorization'];

	if (typeof auth === 'undefined') {
		if (typeof req.body.params.authorization === 'undefined') {
			res.sendStatus(403);
			return;
		}

		auth = req.body.params.authorization;
		delete req.body.params.authorization;
	}

	let decoded = jwt.verify(auth, 'secret');
	console.log(decoded)
	if (typeof decoded.usersq === 'undefined') {
		res.sendStatus(403);
		return;
	}
	next();
}
module.exports = router;
