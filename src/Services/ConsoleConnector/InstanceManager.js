const Instance = require('./Instance.js');
const WebSocket = require('ws');

class InstanceManager {
    constructor(config, discordSessions) {
        this.config = config;
        this.discordSessions = discordSessions;
    }

    _handleError() {
        console.error("Connection failed to Console Service, retrying...");

        setTimeout(
            () => this.init(), 10000
        );
    }

    _setEvents() {
        this.ws.on(
            'error', () => this._handleError()
        );

        this.ws.on(
            'open', () => new Instance(this.ws, this.discordSessions).init()
        );
    }

    _setup() {
        this.ws = new WebSocket(
            `ws://${this.config.CONSOLE_SERVICE_CONFIG.host}:${this.config.CONSOLE_SERVICE_CONFIG.port}`, 
            {
                perMessageDeflate: false
            }
        );
    }

    init() {
        this._setup();
        this._setEvents();
    }   
}

module.exports = InstanceManager;