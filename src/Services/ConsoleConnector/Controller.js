class Controller {

    constructor(config) {
        this.config = config;
    }

    _getGuilds() {
        this.sessions.forEach(
            instance => {
                console.log(instance);
            }
        )

        JSON.stringify();

        return response;
    }

    callRoute(route) {
        let response = "{}";

        switch(route) {
            case "/guilds":
                response = this._getGuilds();
            break;
        }

        return response;
    }

    init(sessions) {
        this.sessions = sessions;
    }

}

module.exports = Controller;