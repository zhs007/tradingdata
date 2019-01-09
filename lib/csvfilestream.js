"use strict";

const fs = require("fs");

class CSVFileStream {
    // callback(stream, isfinish, err)
    constructor(filename, td, head, callback) {
        this.filename = filename;
        this.callback = callback;
        this.isfinish = false;
        this.td = td;

        let hasfile = fs.existsSync(filename);

        this.stream = fs.createWriteStream(filename, {flags: 'a'});

        this.stream.on('finish', () => {
            this.onEvent(true, undefined);
        });

        this.stream.on('error', (err) => {
            this.onEvent(false, err);
        });

        if (!hasfile) {
            this.stream.write(head + '\n');
        }

        this.funcFinish = undefined;
    }

    write(data) {
        this.stream.write(data + '\n');
    }

    finish(func) {
        this.funcFinish = func;

        this.stream.end();
    }

    onEvent(isfinish, err) {
        this.callback(this, isfinish, err);

        if (this.funcFinish != undefined) {
            this.funcFinish(this, isfinish, err);
        }
    }
}

exports.CSVFileStream = CSVFileStream;