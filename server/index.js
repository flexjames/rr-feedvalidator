const http = require('http');
const server = http.createServer();

// Require our express app from the app.js file.
const app = require('./app');

// Every server request runs through our express app!
server.on('request', app);

// Export our server for this file to be require('')d
module.exports = server;