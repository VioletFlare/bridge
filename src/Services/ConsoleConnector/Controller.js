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
        
        const json = {
            guilds: guilds
        }
        
        const response = JSON.stringify(json);

        return response;
    }

    callRoute(route, data) {
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