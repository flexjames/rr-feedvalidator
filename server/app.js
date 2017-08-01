const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const routes = require('../router');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//morgan logs the requests that are being made to the server
app.use(morgan('dev'));

//this tells express to look in the public folder for required files
app.use(express.static(__dirname + '/public'));

//this tells express where to look to interpret the routes
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
});


// //starts the server
// app.listen(1337, function(){
// 	console.log(chalk.green('listening on port 1337'));
// });

module.exports = app;