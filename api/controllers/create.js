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
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .sendFile(gaConfig.pixelPath);

  if (req.query.firstVisit) {
    gaConfig.logger.info(req.query, 'Successfully tracked first visit');

    cloudwatch.recordMetric(req, gaConfig.visitMetricName);
  }
}

module.exports = {
  create: create
};
