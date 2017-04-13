const cloudwatch = require('./../helpers/cloudwatch')
const gaConfig = require('./../../config/ga_config.js');

/**
 * create(req, res)
 *
 * @param {req} HTTP request
 * @param {res} HTTP response
 */
function create(req, res) {
  res
    .status(200)
    .header('Content-Type', 'image/gif')
    .header('Access-Control-Allow-Origin', '*')
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .send();

  if (req.query.firstVisit) {
    cloudwatch.recordMetric(req, gaConfig.visitMetricName);
  }
}

module.exports = {
  create: create
};
