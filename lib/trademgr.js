"use strict";

const { formatDate } = require('./utils');
const { CSVFileStream } = require('./csvfilestream');
// const fs = require("fs");
const path = require("path");
const async = require('async');

class TradeStream {
    // cfg.path
    // cfg.symbol
    constructor(cfg) {
        this.cfg = cfg;
        this.mapStream = {};
    }

    // td - Date
    addTrade(id, td, price, volume, side) {
        let strdate = formatDate(td.getUTCFullYear(), td.getUTCMonth() + 1, td.getUTCDate());
        if (!this.mapStream.hasOwnProperty(strdate)) {
            this.mapStream[strdate] = new CSVFileStream(
                path.join(this.cfg.path, this.cfg.symbol + strdate + '.csv'),
                td,
                'id,ts,price,volume,side',
                (stream, isfinish, err) => {
                    if (err) {
                        console.log(err);
                    }

                    if (isfinish) {
                        delete this.mapStream[strdate];
                        // this.mapStream[strdate] = undefined;
                    }
                });
        }

        this.mapStream[strdate].write(id.toString() + ',' + td.getTime() + ',' + price + ',' + volume + ',' + side);
    }

    onTimer(td) {
        let curtd = Date.now();
        for (let k in this.mapStream) {
            let ds = this.mapStream[k];

            if (curtd.getTime() > ds.td.getTime() + 25 * 60 * 60 * 1000) {
                ds.finish();
            }
        }
    }

    // onfinished()
    finish(onfinished) {
        async.forEachOfSeries(this.mapSymbol, (val, key, callback) => {
            val.finish(() => {
                callback();
            });
        }, (err) => {
            onfinished();
        });
    }
}

class TradeMgr {
    // cfg.path
    // cfg.symbols
    constructor(cfg) {
        this.cfg = cfg;
        this.mapSymbol = {};

        for (let i = 0; i < cfg.symbols.length; ++i) {
            this.mapSymbol[cfg.symbols[i]] = new TradeStream({
                path: cfg.path,
                symbol: cfg.symbols[i],
            });
        }
    }

    // td - Date
    addTrade(symbol, id, td, price, volume, side) {
        if (this.mapSymbol.hasOwnProperty(symbol)) {
            this.mapSymbol[symbol].addTrade(id, td, price, volume, side);
        }
    }

    finish(onfinished) {
        // for (let k in this.mapSymbol) {
        //     this.mapSymbol[k]
        // }

        async.forEachOfSeries(this.mapSymbol, (val, key, callback) => {
            val.finish(() => {
                callback();
            });
        }, (err) => {
            onfinished();
        });
    }
};

exports.TradeMgr = TradeMgr;
exports.TradeStream = TradeStream;