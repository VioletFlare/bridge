const SessionCache = require('./Common/SessionCache.js');
const Server = require("./Server/Server.js");
const Client = require("./Client/Client.js");

class Instance {
    constructor(ws, discordSessions) {
        this.ws = ws;
        this.discordSessions = discordSessions;
        this.sessionCache = new SessionCache();
        this.client = new Client(this.ws);
        this.server = new Server(this.ws, this.discordSessions);
    }

    init() {
        this.server.init();
    
        console.info("Connection established with Console Service!");
    }
}

module.exports = Instance;