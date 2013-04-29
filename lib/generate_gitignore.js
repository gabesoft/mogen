var core = require('./core')
  , path = require('path');

require('colors');

module.exports = function (state, optios, cb) {
    var log = state.log
      , src = path.join(state.templates, 'gitignore')
      , dst = path.join(state.appRoot, '.gitignore');
    core.copyFile(src, dst, core.logFileGen(state.log, dst, cb));
};
