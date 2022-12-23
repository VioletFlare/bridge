const auxConfig = require("../../../AuxConfig.js");

class RequestCreator {

    constructor(config) {
        this.userAgent = auxConfig.USER_AGENT;
    }

    createRequest(route, data = {}) {
        const request = {
            route: route,
            data: {
                userAgent: this.userAgent,
                ...data
            }
        }

        return request;
    }

}

module.exports = RequestCreator;