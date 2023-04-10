const ConsoleConnector = require('console-connector');

class ConsoleController {

    constructor(config, sessions) {
        this.config = config;
        this.sessions = sessions;

        this.consoleConnector = new ConsoleConnector({
            CONSOLE_SERVICE_CONFIG: {
                host: config.CONSOLE_SERVICE_CONFIG.host,
                port: config.CONSOLE_SERVICE_CONFIG.port,
            },
            USER_AGENT: "Bot::Bridge",
            HAS_SERVER: true
        }, this.sessions);
    }

    _registerRoutes() {
        this.consoleConnector.on('/guilds', () => {
            const guilds = [];
    
            this.sessions.forEach(
                instance => {
                    guilds.push({
                        name: instance.guild.name,
                        id: instance.guild.id,
                        channel: {
                            name: instance.channel.name,
                            id: instance.channel.id
                        }
                    })
                }
            )
            
            const response = {
                guilds: guilds
            }
            
            return response;
        });
    }

    init() {
        this.consoleConnector.init();
        this._registerRoutes();
    }

}

module.exports = ConsoleController;