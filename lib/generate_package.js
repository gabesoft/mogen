var core = require('./core')
  , path = require('path');

module.exports = function (state, options, cb) {
    var src = path.join(state.templates, 'package')
      , dst = path.join(state.appRoot, 'package.json');

    core.copyFile(src, dst, function (data) {
        var pack = JSON.parse(data);

        pack.name         = options.name;
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

        return JSON.stringify(pack, null, 2);
    }, core.logFileGen(state.log, dst, cb));
};
