'use strict';

var express = require('express');
var bodyParser = require('body-parser');

require('dotenv').config();

// Import controllers
var create = require('./api/controllers/create.js');
var send = require('./api/controllers/send.js');
var javascript = require('./api/controllers/javascript.js');

var app = express();

app.set('view engine', 'ejs');

// The parser for interpret JSON in req.body
app.use(bodyParser.json());
// The parser for interpret URL parameters
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(clientErrorHandler);
app.use(errorHandler);

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res
      .status(400)
      .json({
        "statusCode": 400,
        "type": "error_type",
        "message": 'something failed!',
        "error": {},
        "debugInfo": {}
      });
  } else {
    next(err);
  }
}

function errorHandler (err, req, res, next) {
  res
    .status(err.status)
    .json({
      "statusCode": err.status,
      "type": "error_type",
      "message": `error request with ${err.body}`,
      "error": {},
      "debugInfo": {}
    });
}

app.options('*', function (req, res) {
  res
    .status(200)
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Origin', '*')
    .send();
})

let router = express.Router();

console.log('Using ' + process.env.BASE_PATH + ' for base path.');

app.use(process.env.BASE_PATH, router);

router.route('/javascript/gaproxy.js')
  .get(javascript.getJavascript);

router.route('/create')
  .get(create.create);

router.route('/send/pageview')
  .get(send.sendPageView);

router.route('/send/event')
  .get(send.sendEvent);

console.log('Server listing on port ' + (process.env.PORT || 3001) + ' at ' + process.env.BASE_PATH + '.');
app.listen(process.env.PORT || 3001);

module.exports = app;
