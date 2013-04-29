var fs = require('fs');

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
            log.error('file ' + file.grey + ' not created');
            log.error(err);
        } else {
            log.info('file ' + file.green + ' created');
        }
        cb(err);
    };
};
