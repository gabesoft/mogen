var core = require('./core')
  , fs   = require('fs')
  , path = require('path');

require('colors');

module.exports = function (state, options, cb) {
    var src   = options.template ? path.join(state.templates, options.template) : null
      , dst   = path.join(state.appRoot, options.dst)
      , log   = core.logFileGen(state.log, dst, cb)
      , trans = function (data) {
            if (options.data) {
                Object.keys(options.data).forEach(function (k) {
                    data = data.replace('{{' + k + '}}', options.data[k]);
                });
            }
            return data;
        };
    if (src) {
        core.copyFile(src, dst, log);
    } else {
        fs.writeFile(dst, options.data, log);
    }
};

