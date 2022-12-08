class Requester {

    constructor(config) {
        this.userAgent = "Bot::Bridge";
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

module.exports = Requester;