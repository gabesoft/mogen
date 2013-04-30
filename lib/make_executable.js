var fs   = require('fs')
  , path = require('path');

module.exports = function (state, options, cb) {
    var file = path.join(state.appRoot, options.file);
    fs.chmod(file, '777', cb);
};
