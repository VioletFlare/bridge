const Controller = require("./Controller.js");

class Server {
    constructor(ws, discordSessions) {
        this.ws = ws;
        this.controller = new Controller(this.cache, discordSessions);
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
    }
}

module.exports = Server;