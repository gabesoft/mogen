var fs = require('fs');

module.exports.fileExists = function (file, cb) {
    fs.stat(file, function (err, stats) {
        cb(!err && stats.isFile());
    });
};

module.exports.copyFile = function (src, dst, transform, cb) {
    if (!cb) {
        cb        = transform;
        transform = function (data) { return data; };
    }

    fs.readFile(src, 'utf8', function (err, data) {
        fs.writeFile(dst, transform(data), cb);
    });
};

module.exports.logFileGen = function (log, file, cb) {
    return function (err) {
        if (err) {
            log.error('file ' + file.blue + ' not created');
            log.error(err);
        } else {
            log.info('file ' + file.green + ' created');
        }
        cb(err);
    };
};
