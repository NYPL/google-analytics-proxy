const winston = require('winston');

module.exports = {
  googleBaseUrl: 'https://www.google-analytics.com',
  visitMetricName: 'Visit',
  pageViewMetricName: 'PageView',
  logger: new winston.Logger({
    transports: [
      new winston.transports.Console({
        json: true
      })
    ]
  })
};