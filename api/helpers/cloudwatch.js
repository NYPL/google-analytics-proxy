const logger = require('winston')

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

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
      logger.error(err, err.stack);
      return false;
    }

    logger.info('Recorded CloudWatch metric: ' + req.query.metricNameSpace + ':' + metricName);
    return true;
  });
}

module.exports = {
  recordMetric: recordMetric
};