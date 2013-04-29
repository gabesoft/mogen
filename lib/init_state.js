var path = require('path');

module.exports = function (state, options, cb) {
    state.appRoot = path.resolve(options.name);
    state.name    = options.name;
    cb();
};
