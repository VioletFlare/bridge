const WebSocket = require('ws');

class ConsoleConnector {
    constructor(config) {
        this.config = config;
    }

    _setEvents() {
        this.ws.on('error', () => {
            console.error("Connection failed to Console Service, retrying...");

            setTimeout(
                () => this.init(), 10000
            );
        });

        this.ws.on('open', () => {
            console.info("Connection established with Console Service!")

            this.ws.send('something');
        });
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

module.exports = ConsoleConnector;