const RequestCreator = require("./RequestCreator.js");

class Client {

    constructor(ws) {
        this.ws = ws;
        this.requestCreator = new RequestCreator(this.cache);
    }

    sendRequest(route, data = {}) {
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

            const request = this.requestCreator.createRequest(route, data);

            this.ws.send(JSON.stringify(
                request
            ));
        });

        return response;
    }

}

module.exports = Client;