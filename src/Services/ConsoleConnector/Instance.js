const Controller = require('./Controller.js');
const Requester = require('./Requester.js');
const SessionCache = require('./SessionCache.js');

class Instance {
    constructor(ws, discordSessions) {
        this.ws = ws;
        this.discordSessions = discordSessions;
        this.sessionCache = new SessionCache();
        this.controller = new Controller();
        this.requester = new Requester();
    }

    _sendRequest(route, data = {}) {
        const response = new Promise((resolve, reject) => {
            const _handler = (data) => {
                const jsonString = data.toString("utf8");
                const response = JSON.parse(jsonString);
    
                const isEmpty = Object.keys(response).length === 0;
    
                if (!isEmpty) {
                    const isResponse = response.calledRoute && route === response.calledRoute;
    
                    if (isResponse) {
                        this.ws.removeEventListener("message", _handler);

                        resolve(response);
                    }
                }
            };

            this.ws.on("message", _handler);

            const request = this.requester.createRequest(route, data);

            this.ws.send(JSON.stringify(
                request
            ));
        });

        return response;
    }

    _authenticate() {
        this._sendRequest('/auth', {});
    }

    _listenForRequests() {
        this.ws.on("message", (data) => {
            const jsonString = data.toString("utf8");
            const json = JSON.parse(jsonString);

            const isEmpty = Object.keys(json).length === 0;

            if (!isEmpty) {
                const isRequest = json.route;

                if (isRequest) {
                    const route = json.route;
                    const data = json.data;
                    const response = this.controller.callRoute(route, data);
                    this.ws.send(response);
                }
            }
        });
    }

    init() {
        this._listenForRequests();
    
        console.info("Connection established with Console Service!");

        this._authenticate();   
        this.controller.init(this.discordSessions);
    }
}

module.exports = Instance;