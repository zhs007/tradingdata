"use strict";

const { WebSocketClient } = require('../../lib/wsclient');
const { TRADETYPE } = require('../../lib/basedef');
const { TradeMgr } = require('../../lib/trademgr');
// const crypto = require('crypto');

class BitmexDataStream extends WebSocketClient {
    // cfg.addr - like wss://testnet.bitmex.com/realtime
    // cfg.symbols - [XBTUSD]
    constructor(cfg) {
        super(cfg);

        this.mgrTrade = new TradeMgr({
            path: './output/bitmex/',
            symbols: this.cfg.symbols,
        });
    }

    _procConfig() {
        super._procConfig();

        if (!this.cfg.addr) {
            // this.cfg.addr = 'wss://testnet.bitmex.com/realtime';
            this.cfg.addr = 'wss://www.bitmex.com/realtime';
        }

        if (!this.cfg.symbols) {
            this.cfg.symbols = ['XBTUSD'];
        }
    }

    _addChannel() {
        let args = [];
        for (let i = 0; i < this.cfg.symbols.length; ++i) {
            args.push('trade:' + this.cfg.symbols[i]);
        }

        this.sendMsg({
            op: 'subscribe',
            args: args,
        });
    }

    _onChannel_Deals(data) {
        for (let i = 0; i < data.length; ++i) {
            this.mgrTrade.addTrade(data[i].symbol,
                data[i].trdMatchID,
                new Date(data[i].timestamp),
                parseFloat(data[i].price),
                parseFloat(data[i].size),
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

        console.log('bitmex open ');

        this._addChannel();
    }

    _onMsg(data) {
        super._onMsg(data);

        if (data == 'pong') {
            return ;
        }

        try{
            let msg = JSON.parse(data);
            if (msg) {
                if (msg.table == 'trade') {
                    if (msg.action == 'insert' || msg.action == 'partial') {
                        this._onChannel_Deals(msg.data);
                    }
                }
                else {
                    console.log(data);
                }
            }
        }
        catch (err) {
            console.log('bitmex onmsg err! ' + err + ' ' + data);
            this.close();
        }
    }

    _onClose() {
        console.log('bitmex close ');

        super._onClose();
    }

    _onError(err) {
        console.log('bitmex error ' + JSON.stringify(err));

        super._onError(err);
    }

    _onKeepalive() {
        this.sendMsg('ping');

        super._onKeepalive();
    }
};

exports.BitmexDataStream = BitmexDataStream;