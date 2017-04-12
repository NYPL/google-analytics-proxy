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
    .sendFile('collect.gif', {
      root: __dirname + '/../../static'
    });
}

module.exports = {
  create: create
};
