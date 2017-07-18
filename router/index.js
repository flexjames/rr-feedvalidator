const path = require('path');
const chalk = require('chalk');
const express = require('express');
const router = express.Router();

//creates the full path to the index.html file
const indexHTMLPath = path.join(__dirname, '../index.html');


router.get('/', function(req, res, next){
	console.log(chalk.green('Made it to the / route successfully'));
	res.sendFile(indexHTMLPath);
});

module.exports = router;