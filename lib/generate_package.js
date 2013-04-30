var core = require('./core')
  , path = require('path');

module.exports = function (state, options, cb) {
    var src = path.join(state.templates, 'package')
      , log = state.log
      , dst = path.join(state.appRoot, 'package.json');

    core.fileExists(dst, function (exists) {
        if (exists) {
            log.warn('file ' + dst.blue + ' already exists');
            return cb();
        }

        core.copyFile(src, dst, function (data) {
            var pack = JSON.parse(data)
              , name = options.name;

            pack.name         = name;
            pack.description  = options.desc;
            pack.bin          = {};
            pack.repository   = {};
            pack.preferGlobal = options.cli;

            if (options.cli) {
                pack.bin[name] = './bin/' + name;
            } 

            if (options['git-user']) {
                pack.repository.type = 'git';
                pack.repository.url = 'git@github.com:' + options['git-user'] + '/' + options.name + '.git';
            }

            if (options.author) {
                pack.author.name  = options.author;
                pack.author.email = options['author-email'];
            }

            if (options.license) {
                pack.license = 'MIT';
            }

            return JSON.stringify(pack, null, 2);
        }, core.logFileGen(log, dst, cb));
    });
};
