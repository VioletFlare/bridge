const WebSocket = require('ws');
const Controller = require('./Controller.js');

class ConsoleConnector {
    constructor(config) {
        this.config = config;
        this.controller = new Controller(config);
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

            this.ws.on(
                "message", (data) => {
                    const route = data.toString('utf8');
                    const response = this.controller.callRoute(route);
                    this.ws.send(response);
                }
            )
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

    init(sessions) {
        this._setup();
        this._setEvents();

        this.controller.init(sessions);
    }   
}

module.exports = ConsoleConnector;