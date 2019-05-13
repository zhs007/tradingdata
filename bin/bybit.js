"use strict";

const { BybitDataStream } = require('../market/bybit/datastream');
const process = require('process');

let bybit = new BybitDataStream({
    addr: 'wss://stream.bybit.com/realtime',
    symbols: ['BTCUSD'],
    funcOnClose: () => {
        console.log('bybit close');

        bybit.mgrTrade.finish(() => {
            process.exit();
        });
    },
    funcOnError: (err) => {
        console.log('bybit error ' + err);

        bybit.mgrTrade.finish(() => {
            process.exit();
        });
    },
});

process.on('unhandledRejection', (reason, p) => {
    console.log('error', 'Unhandled Rejection at: ' + p + ' reason: ' + reason);

    bybit.mgrTrade.finish(() => {
        process.exit();
    });
});

process.on('uncaughtException', (err) => {
    console.log('error', 'Unhandled Exception: ' + JSON.stringify(err));

    bybit.mgrTrade.finish(() => {
        process.exit();
    });
});

bybit.init();