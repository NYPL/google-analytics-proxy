const bunyan = require('bunyan')
const path = require('path');

module.exports = {
  googleBaseUrl: 'https://www.google-analytics.com',
  visitMetricName: 'Visit',
  pageViewMetricName: 'PageView',
  logger: bunyan.createLogger({
    name: 'App'
  }),
  pixelPath: path.resolve(__dirname + '/../static/collect.gif')
};