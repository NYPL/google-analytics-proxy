'use strict'

const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const binaryTypes = [
  'image/gif'
]

const server = awsServerlessExpress.createServer(app, null, binaryTypes);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);