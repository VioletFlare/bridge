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

        switch(route) {
            case "/guilds":
                response = this._getGuilds();
            break;
        }

        response.calledRoute = route;

        const responseString = JSON.stringify(response);
        
        return responseString;
    }

    init(sessions) {
        this.sessions = sessions;
    }

}

module.exports = Controller;