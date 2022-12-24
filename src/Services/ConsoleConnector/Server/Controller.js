class Controller {

    constructor(cache, sessions) {
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

    _getRouteData(route, data) {
        let response;

        switch(route) {
            case "/guilds":
                response = this._getGuilds();
            break;
        }

        return response;
    }

    callRoute(route, data) {
        let response = {};

        response.data = this._getRouteData(route, data);
        
        return response;
    }

}

module.exports = Controller;