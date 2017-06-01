'use strict'

const express = require('express')
const morgan = require('morgan')

require('dotenv').config()

const minify = require('express-minify')

const gaConfig = require('./config/ga_config.js');
const create = require('./api/controllers/create.js')
const send = require('./api/controllers/send.js')
const javascript = require('./api/controllers/javascript.js')

const app = express()

app.set('view engine', 'ejs')
app.enable('trust proxy');
app.disable('x-powered-by')
app.use(minify())

app.options('*', function (req, res) {
  res
    .status(200)
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Access-Control-Allow-Origin', '*')
    .send()
})

let router = express.Router()
app.use(morgan('combined'));
app.use(process.env.BASE_PATH, router)

router.route('/swagger')
  .get(function (req, res) {
    res
      .status(200)
      .header('Access-Control-Allow-Headers', 'Content-Type')
      .header('Access-Control-Allow-Origin', '*')
      .sendFile(__dirname + '/swagger/v0.1.json')
  })

router.route('/javascript/gaproxy.js')
  .get(javascript.getJavascript)

router.route('/create')
  .get(create.create)

router.route('/send/pageview')
  .get(send.sendPageView)

router.route('/send/event')
  .get(send.sendEvent)

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  gaConfig.logger.info('Using ' + process.env.BASE_PATH + ' for base path.')
  gaConfig.logger.info('Server listening on port ' + (process.env.PORT || 3001) + ' at ' + process.env.BASE_PATH + '.')
  app.listen(process.env.PORT || 3001)
}

module.exports = app
