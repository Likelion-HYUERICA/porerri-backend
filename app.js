const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');
const config = require('./config');

const conn = mysql.createConnection(config);
/* =======================
 LOAD THE CONFIG
 ==========================*/
const port = process.env.PORT || 8888;

/* =======================
 EXPRESS CONFIGURATION
 ==========================*/
const app = express();
// process.on('uncaughtException', function(err) {
// 	console.log('Caught exception: ' + err);
// });
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// parse JSON and url-encoded query
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.post('/mylocation', (req, res) => {
	const { whoami, whereami } = req.body;
	conn.query(
		'INSERT INTO log(whoami, whereami) VALUES(?, ?)',
		[whoami, whereami],
		(err) => {
			if(err) throw err;
			res.redirect('http://localhost:8000/');
		}
	)
});
app.get('/recent/one', (req, res) => {
	conn.query(
		'SELECT whoami, whereami FROM log ORDER BY timestamp DESC LIMIT 1 ',
		(err, result) => {
			if(err) throw err;
			return res.status(200).json({
				result
			})
		}
	)
});
// print the request log on console
app.use(morgan(':remote-addr'), function(req, res, next) {
	next();
});

app.use(morgan(':method'), function(req, res, next) {
	next();
});

app.use(morgan(':url'), function(req, res, next) {
	next();
});

app.use(morgan(':date'), function(req, res, next) {
	next();
});

app.use(morgan(':status'), function(req, res, next) {
	next();
});

// set the secret key variable for jwt
app.set('jwt-secret', config.secret);
// index page, just for testing

// open the server
app.listen(port, () => {
	console.log(`Express is running on port ${port}`)
});
