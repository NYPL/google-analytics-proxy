/**
 * getJavascript(req, res)
 *
 * @param {req} HTTP request
 * @param {res} HTTP response
 */
function getJavascript(req, res) {
  res
    .status(200)
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'Content-Type')
    .header('Content-Type', 'application/javascript')
    .header('Cache-Control', 'max-age=600')
    .render('gap', {
      serviceBaseUrl: _buildServiceBaseUrl(req)
    });
}

function _getHost(req) {
    // This is a slightly custom way to get the host behind a proxy.
    return (req.headers['forwarded-host'] || '').split(':')[0] || req.get('host');
}

function _buildServiceBaseUrl(req) {
    if (process.env.SERVICE_DYNAMIC_BASE_URL == 'true') {
        // This unfortunately only works on port 80 or by luck on other ports
        return req.protocol + '://' + _getHost(req) + process.env.SERVICE_BASE_URL
    } else {
        return process.env.SERVICE_BASE_URL
    }
}

module.exports = {
  getJavascript: getJavascript
};
