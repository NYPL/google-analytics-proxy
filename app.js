'use strict';

const express = require('express');

require('dotenv').config();

const logger = require('winston')
const minify = require('express-minify');

const create = require('./api/controllers/create.js');
const send = require('./api/controllers/send.js');
const javascript = require('./api/controllers/javascript.js');

const app = express();

app.set('view engine', 'ejs');
app.use(minify());

app.options('*', function (req, res) {
  res
    .status(200)
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Origin', '*')
    .send();
})


let router = express.Router();
app.use(process.env.BASE_PATH, router);

router.route('/javascript/gaproxy.js')
  .get(javascript.getJavascript);

router.route('/create')
  .get(create.create);

router.route('/send/pageview')
  .get(send.sendPageView);

router.route('/send/event')
  .get(send.sendEvent);


if (process.env.LOCAL) {
  logger.info('Using ' + process.env.BASE_PATH + ' for base path.');
  logger.info('Server listing on port ' + (process.env.PORT || 3001) + ' at ' + process.env.BASE_PATH + '.');
  app.listen(process.env.PORT || 3001);
}

module.exports = app;
