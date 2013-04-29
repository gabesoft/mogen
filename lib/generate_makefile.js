var core = require('./core')
  , path = require('path');

require('colors');

module.exports = function (state, options, cb) {
    var ext = options.js ? 'js' : 'coffee'
      , src = path.join(state.templates, 'makefile_' + ext)
      , dst = path.join(state.appRoot, 'Makefile');
    core.copyFile(src, dst, core.logFileGen(state.log, dst, cb));
};

