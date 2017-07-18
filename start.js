const chalk = require('chalk');

// Grabbing our server from our server/index.js file.
var server = require('./server');

var PORT = process.env.PORT || 1337;

server.listen(PORT, function(){
	console.log(chalk.green('listening on port 1337'));
});