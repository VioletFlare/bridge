const WebSocket = require('ws');
const Controller = require('./Controller.js');
const Requester = require('./Requester.js');

class ConsoleConnector {
    constructor(config) {
        this.config = config;
        this.controller = new Controller(config);
        this.Requester = new Requester();
    }

    _sendRequest(route, data = {}) {
        const request = Requester.createRequest(route, data);

        this.ws.send(JSON.stringify(
            request
        ));
    }

    _authenticate() {
        this._sendRequest('/auth', {});
    }

    _setMessageHandler() {
        this.ws.on(
            "message", (data) => {
                const jsonString = data.toString('utf8');
                const object = JSON.parse(jsonString);

                const isEmpty = Object.keys(object).length === 0;

                if (!isEmpty) {
                    const isRequest = object.route;

                    if (isRequest) {
                        const route = object.route;
                        const data = object.data;
                        const response = this.controller.callRoute(route, data);
                        this.ws.send(response);
                    }
                }
            }
        )
    }

    _setEvents() {
        this.ws.on('error', () => {
            console.error("Connection failed to Console Service, retrying...");

            setTimeout(
                () => this.init(), 10000
            );
        });

        this.ws.on('open', () => {
            console.info("Connection established with Console Service!");
            this._authenticate();
            this._setMessageHandler();
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