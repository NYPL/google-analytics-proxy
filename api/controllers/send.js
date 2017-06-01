'use strict';

const axios = require('axios');
const gaConfig = require('./../../config/ga_config.js');
const querystring = require('querystring');
const cloudwatch = require('./../helpers/cloudwatch')

/**
 * checkRequiredParameters(req)
 *
 * @param {req} HTTP request
 */
function checkMinimumParameters (req) {
  if (!req.query.trackingId) throw new Error('Tracking ID was not specified.')
  if (!req.query.clientId) throw new Error('Client ID was not specified.')
}

function _extractClientIP(req) {
    var clientIP = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';

    return clientIP.split(',')[0];
}

/**
 * sendPageView(req, res)
 *
 * @param {req} HTTP request
 * @param {res} HTTP response
 */
function sendPageView (req, res) {
  checkMinimumParameters(req);

  if (!req.query.page) throw new Error('Page was not specified.')

  let payLoad = {
    v: 1,
    tid: req.query.trackingId,
    cid: req.query.clientId,
    t: 'pageview',
    uip: _extractClientIP(req),
    ua: req.get('User-Agent'),
    dh: req.query.host,
    dp: req.query.page
  };

  axios({
    method: 'post',
    url: gaConfig.googleBaseUrl + '/collect',
    data: querystring.stringify(payLoad),
    headers: {}
  })
    .then(response => {
      gaConfig.logger.info(payLoad, 'Successfully tracked page view');
    })
    .catch(response => {
      gaConfig.logger.error(payLoad, response, 'Error tracking pageview');
    });

  res
    .status(200)
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .sendFile(gaConfig.pixelPath);

  cloudwatch.recordMetric(req, gaConfig.pageViewMetricName);
}

/**
 * sendEvent(req, res)
 *
 * @param {req} HTTP request
 * @param {res} HTTP response
 */
function sendEvent (req, res) {
  checkMinimumParameters(req);

  if (!req.query.eventCategory) throw new Error('Event category was not specified.')
  if (!req.query.eventAction) throw new Error('Event action was not specified.')

  let payLoad = {
    v: 1,
    tid: req.query.trackingId,
    cid: req.query.clientId,
    t: 'event',
    uip: _extractClientIP(req),
    ua: req.get('User-Agent'),
    ec: req.query.eventCategory,
    ea: req.query.eventAction
  };



  if (req.query.eventLabel) payLoad.el = req.query.eventLabel
  if (req.query.eventValue) payLoad.ev = req.query.eventValue

  axios({
    method: 'post',
    url: gaConfig.googleBaseUrl + '/collect',
    data: querystring.stringify(payLoad),
    headers: {}
  })
    .then(response => {
      gaConfig.logger.info(payLoad, 'Successfully tracked event');
    })
    .catch(response => {
      gaConfig.logger.error(payLoad, response, 'Error tracking event');
    });

  res
    .status(200)
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .sendFile(gaConfig.pixelPath);

  cloudwatch.recordMetric(req, gaConfig.pageViewMetricName);
}

module.exports = {
  sendPageView: sendPageView,
  sendEvent: sendEvent
};
