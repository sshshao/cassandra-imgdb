const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

global.appRoot = path.resolve(__dirname);

var router = express.Router();
var action = require('./routes/action');

var app = express();
console.log("Server running at http://127.0.0.1:8080/");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

http.createServer(app).listen(8080);

var upload = multer({ dest: 'uploads/' });
router.post('/deposit', upload.single('contents'), action.deposit);
router.get('/retrieve', action.retrieve);

app.use('/', router);
app.listen(5000);