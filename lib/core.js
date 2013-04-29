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
            log.error('failed to generate ' + file.grey);
            log.error(err);
        } else {
            log.info('generated ' + file.green);
        }
        cb(err);
    };
};
