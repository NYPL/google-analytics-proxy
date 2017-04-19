const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();
const gaConfig = require('./../../config/ga_config.js');

function recordMetric(req, metricName) {
  if (!req.query.metricNameSpace) {
    return false;
  }

  const params = {
    MetricData: [
      {
        MetricName: metricName,
        Value: 1
      },
    ],
    Namespace: req.query.metricNameSpace
  };

  cloudwatch.putMetricData(params, function(err, data) {
    if (err) {
      gaConfig.logger.error(err, err.stack);
      return false;
    }

    gaConfig.logger.info('Recorded CloudWatch metric: ' + req.query.metricNameSpace + ':' + metricName);
    return true;
  });
}

module.exports = {
  recordMetric: recordMetric
};