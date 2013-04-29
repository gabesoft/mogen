var fs   = require('fs')
  , core = require('./core')
  , path = require('path');

require('colors');

module.exports = function (state, options, cb) {
    var ext = options.js ? 'js' : 'coffee' 
      , dst = path.join(state.appRoot, 'index.' + ext);
    fs.writeFile(dst
      , '//TODO: implement'
      , core.logFileGen(state.log, dst, cb));
};

