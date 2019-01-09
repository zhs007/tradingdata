"use strict";

const WebSocket = require('ws');

class WebSocketClient {
    // cfg.addr
    // cfg.timeout_keepalive
    // cfg.timeout_connect
    // cfg.timeout_message
    // cfg.funcOnOpen
    // cfg.funcOnMsg
    // cfg.funcOnClose
    // cfg.funcOnError
    // cfg.funcOnKeepalive
    // cfg.timetick
    constructor(cfg) {
        this.cfg = cfg;

        this.ws = undefined;

        this.lastts = new Date().getTime();

        this._procConfig();

        this.connecting = false;
        this.tmsConnect = 0;

        this.tmsKeepalive = 0;

        this.timerTick = setInterval(() => {
            this._onTick();
        }, this.cfg.timetick);
    }

    _procConfig() {
        if (!this.cfg.timeout_keepalive) {
            this.cfg.timeout_keepalive = 30 * 1000;
        }

        if (!this.cfg.timeout_connect) {
            this.cfg.timeout_connect = 90 * 1000;
        }

        if (!this.cfg.timeout_message) {
            this.cfg.timeout_message = 30 * 1000;
        }

        if (!this.cfg.timetick) {
            this.cfg.timetick = 1000;
        }
    }

    init() {
        if (this.connecting) {
            return ;
        }

        this.connecting = true;
        this.tmsConnect = new Date().getTime();

        this.ws = undefined;

        this.ws = new WebSocket(this.cfg.addr);

        this.ws.on('open', () => {
            this.connecting = false;
            this._onOpen();
        });

        this.ws.on('message', (data) => {
            this._onMsg(data);
        });

        this.ws.on('close', () => {
            this.connecting = false;
            this._onClose();
        });

        this.ws.on('error', (err) => {
            this._onError(err);
        });
    }

    _send(buff) {
        if (!this.isConnected()) {
            return ;
        }

        this.ws.send(buff);
    }

    isConnecting() {
        return this.connecting;
    }

    isConnected() {
        if (this.ws == undefined) {
            return false;
        }

        if (this.ws.readyState !== WebSocket.OPEN) {
            return false;
        }

        return true;
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    //------------------------------------------------------------------------------
    // 需要重载的接口

    sendMsg(msg) {
    }

    _onOpen() {
        if (this.cfg.funcOnOpen) {
            this.cfg.funcOnOpen();
        }
    }

    _onMsg(data) {
        this.lastts = new Date().getTime();

        if (this.cfg.funcOnMsg) {
            this.cfg.funcOnMsg(data);
        }
    }

    _onClose() {
        this.init();

        if (this.cfg.funcOnClose) {
            this.cfg.funcOnClose();
        }
    }

    _onError(err) {
        if (this.cfg.funcOnError) {
            this.cfg.funcOnError(err);
        }

        this.ws.close();
    }

    _onKeepalive() {
        if (this.cfg.funcOnKeepalive) {
            this.cfg.funcOnKeepalive();
        }
    }

    _onTick() {
        let ts = new Date().getTime();
        if (this.isConnected()) {
            if (ts - this.lastts >= this.cfg.timeout_keepalive && ts - this.tmsKeepalive >= this.cfg.timeout_keepalive) {
                this.tmsKeepalive = ts;
                this._onKeepalive();
            }

            if (this.tmsKeepalive - this.lastts > this.cfg.timeout_message) {
                this.close();
            }
        }
        else if (this.isConnecting()) {
            if (ts - this.tmsConnect >= this.cfg.timeout_connect) {
                this.close();
            }
        }
    }
};

exports.WebSocketClient = WebSocketClient;