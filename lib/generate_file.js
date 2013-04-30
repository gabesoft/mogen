var core = require('./core')
  , fs   = require('fs')
  , path = require('path');

require('colors');

module.exports = function (state, options, cb) {
    var src   = options.template ? path.join(state.templates, options.template) : null
      , dst   = path.join(state.appRoot, options.dst)
      , log   = state.log
      , trans = function (data) {
            if (options.data) {
                Object.keys(options.data).forEach(function (k) {
                    data = data.replace('{{' + k + '}}', options.data[k]);
                });
            }
            return data;
        };

    core.fileExists(dst, function (exists) {
        if (exists) {
            log.warn('file ' + dst.blue + ' already exists');
            return cb();
        }
        if (src) {
            core.copyFile(src, dst, trans, core.logFileGen(log, dst, cb));
        } else {
            fs.writeFile(dst, options.data, core.logFileGen(log, dst, cb));
        }
    });
};

