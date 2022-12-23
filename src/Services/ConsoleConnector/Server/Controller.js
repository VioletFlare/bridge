const auxConfig = require("../../../AuxConfig.js");

class Controller {

    constructor(cache, sessions) {
        this.userAgent = auxConfig.USER_AGENT;
        this.sessions = sessions;
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
        response.data.userAgent = this.userAgent;
        response.calledRoute = route;

        const responseString = JSON.stringify(response);
        
        return responseString;
    }

}

module.exports = Controller;