"use strict";

const { WebSocketClient } = require('../../lib/wsclient');
const { TRADETYPE } = require('../../lib/basedef');
const { TradeMgr } = require('../../lib/trademgr');
// const crypto = require('crypto');

class BybitDataStream extends WebSocketClient {
    // cfg.addr - like wss://stream.bybit.com/realtime
    // cfg.symbols - [BTCUSD]
    constructor(cfg) {
        super(cfg);

        this.mgrTrade = new TradeMgr({
            path: './output/bybit/',
            symbols: this.cfg.symbols,
        });
    }

    _procConfig() {
        super._procConfig();

        if (!this.cfg.addr) {
            // this.cfg.addr = 'wss://testnet.bitmex.com/realtime';
            this.cfg.addr = 'wss://stream.bybit.com/realtime';
        }

        if (!this.cfg.symbols) {
            this.cfg.symbols = ['BTCUSD'];
        }
    }

    _addChannel() {
        let args = [];
        for (let i = 0; i < this.cfg.symbols.length; ++i) {
            args.push('trade.' + this.cfg.symbols[i]);
        }

        this.sendMsg({
            op: 'subscribe',
            args: args,
        });
    }

    _onChannel_Deals(data) {
        for (let i = 0; i < data.length; ++i) {
            this.mgrTrade.addTrade(data[i].symbol,
                data[i].trade_id,
                new Date(data[i].timestamp),
                data[i].price,
                data[i].size,
                data[i].side == 'Buy' ? TRADETYPE.BUY : TRADETYPE.SELL);
        }
    }

    //------------------------------------------------------------------------------
    // WebSocketClient

    sendMsg(msg) {
        this._send(JSON.stringify(msg));
    }

    _onOpen() {
        super._onOpen();

        console.log('bybit open ');

        this._addChannel();
    }

    _onMsg(data) {
        super._onMsg(data);

        try{
            let msg = JSON.parse(data);
            if (msg) {

                if (msg.hasOwnProperty('success')) {

                } else if (msg.hasOwnProperty('topic')) {
                    let arr = msg.topic.split('.');

                    if (arr[0] == 'trade') {
                        this._onChannel_Deals(msg.data);
                    }
                    else {
                        console.log(data);
                    }
                }
            }
        }
        catch (err) {
            console.log('bybit onmsg err! ' + err + ' ' + data);
            this.close();
        }
    }

    _onClose() {
        console.log('bybit close ');

        super._onClose();
    }

    _onError(err) {
        console.log('bybit error ' + JSON.stringify(err));

        super._onError(err);
    }

    _onKeepalive() {
        let msg = {
            op: 'ping',
        };

        this.sendMsg(msg);

        super._onKeepalive();
    }
};

exports.BybitDataStream = BybitDataStream;