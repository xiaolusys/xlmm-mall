var _ = require('lodash');
var path = require('path');
var fs = require("fs");
var mockConfig = require('./mock.config');

module.exports = function() {
  return function(req, resp, next) {
    var mockDir = _.get(mockConfig, req.path) && _.get(mockConfig, req.path)[req.method] ? _.get(mockConfig, req.path)[req.method] : '';
    if (mockDir) {
      var jsonFile = fs.readFileSync(path.join(__dirname, mockDir), 'utf-8')
      req.accepts('application/json');
      resp.type('application/json');
      resp.json(JSON.parse(jsonFile));
      console.log(' --> Request mock: ', req.path);
      console.log(' --> Rsponse mock: ', JSON.parse(jsonFile))
    }
    next();
  };
};
