"use strict";

const { BitmexDataStream } = require('../market/bitmex/datastream');
const process = require('process');

let bitmex = new BitmexDataStream({
    addr: 'wss://www.bitmex.com/realtime',
    symbols: ['XBTUSD', 'XBTM19', 'XBTH19'],
    funcOnClose: () => {
        console.log('bitmex close');

        bitmex.mgrTrade.finish(() => {
            process.exit();
        });
    },
    funcOnError: (err) => {
        console.log('bitmex error ' + err);

        bitmex.mgrTrade.finish(() => {
            process.exit();
        });
    },
});

process.on('unhandledRejection', (reason, p) => {
    console.log('error', 'Unhandled Rejection at: ' + p + ' reason: ' + reason);

    bitmex.mgrTrade.finish(() => {
        process.exit();
    });
});

process.on('uncaughtException', (err) => {
    console.log('error', 'Unhandled Exception: ' + JSON.stringify(err));

    bitmex.mgrTrade.finish(() => {
        process.exit();
    });
});

bitmex.init();