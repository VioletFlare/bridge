class Controller {

    constructor(config) {
        this.config = config;
    }

    _getGuilds() {
        const guilds = [];

        this.sessions.forEach(
            instance => {
                guilds.push({
                    name: instance.guild.name,
                    id: instance.guild.id
                })
            }
        )
        
        const response = {
            guilds: guilds
        }
        
        return response;
    }

    callRoute(route, data) {
        let response = {};
        let baseResponse;

        switch(route) {
            case "/guilds":
                baseResponse = this._getGuilds();
            break;
        }

        response.data = baseResponse;
        response.calledRoute = route;

        const responseString = JSON.stringify(response);
        
        return responseString;
    }

    init(sessions) {
        this.sessions = sessions;
    }

}

module.exports = Controller;