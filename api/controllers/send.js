'use strict';

const axios = require('axios');
const gaConfig = require('./../../config/ga_config.js');
const querystring = require('querystring');

const logger = require('winston')

/**
 * sendPageView(req, res)
 *
 * @param {req} HTTP request
 * @param {res} HTTP response
 */
function sendPageView(req, res) {
  if (!req.query.trackingId) throw new Error('Tracking ID was not specified.')
  if (!req.query.page) throw new Error('Page was not specified.')
  if (!req.query.clientId) throw new Error('Client ID was not specified.')

  let payLoad = querystring.stringify({
    v: 1,
    tid: req.query.trackingId,
    cid: req.query.clientId,
    t: 'pageview',
    dh: req.query.host,
    dp: req.query.page
  });

  axios({
    method: 'post',
    url: gaConfig.googleBaseUrl + '/collect',
    data: payLoad,
    headers: {
    }
  })
    .then(response => {
      logger.info('Successfully tracked page view (' + payLoad + ').');
    })
    .catch(response => {
      logger.error('Error tracking pageview: ' + response.message);
    });

  res
    .status(200)
    .header('Content-Type', 'image/gif')
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .header('Access-Control-Allow-Origin', '*')
    .sendFile('collect.gif', {
      root: __dirname + '/../../static'
    })
}

/**
 * sendEvent(req, res)
 *
 * @param {req} HTTP request
 * @param {res} HTTP response
 */
function sendEvent(req, res) {
  if (!req.query.trackingId) throw new Error('Tracking ID was not specified.')
  if (!req.query.eventCategory) throw new Error('Event category was not specified.')
  if (!req.query.eventAction) throw new Error('Event action was not specified.')
  if (!req.query.clientId) throw new Error('Client ID was not specified.')

  let payLoad = querystring.stringify({
    v: 1,
    tid: req.query.trackingId,
    cid: req.query.clientId,
    t: 'event',
    ec: req.query.eventCategory,
    ea: req.query.eventAction
  });

  if (req.query.eventLabel) payLoad.el = req.query.eventLabel
  if (req.query.eventValue) payLoad.ev = req.query.eventValue

  axios({
    method: 'post',
    url: gaConfig.googleBaseUrl + '/collect',
    data: payLoad,
    headers: {
    }
  })
    .then(response => {
      logger.info('Successfully tracked event (' + payLoad + ').');
    })
    .catch(response => {
      logger.error('Error tracking event: ' + response.message);
    });

  res
    .status(200)
    .header('Content-Type', 'image/gif')
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .header('Access-Control-Allow-Origin', '*')
    .sendFile('collect.gif', {
      root: __dirname + '/../../static'
    });
}

module.exports = {
  sendPageView: sendPageView,
  sendEvent: sendEvent
};
