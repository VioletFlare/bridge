const Bridge = require('./Bridge.js');
const config = require('../config.js');
const Discord = require("discord.js");
const DAL = require("./DAL/DataLayer.js");

class InstanceManager {
    
    constructor() {
        this.isDev = process.argv.includes("--dev");
        this.client = new Discord.Client({ 
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']
        });

        this.sessions = new Map();
    }

    _onMessageCreate(msg) {
        const guildId = msg.guild.id;
        const bridge = this.sessions.get(guildId);
        
        if (bridge) {
            bridge.onMessageCreate(msg)
        }
    }

    _initSessions() {
        if (!this.sessions.size) {
            for (const [guildId, guild] of this.client.guilds.cache.entries()) {
                const bridge = new Bridge(guild, DAL);
                bridge.init();
                this.sessions.set(guildId, bridge);
            }
        }
    }

    _initSession(guild) {
        const bridge = new Bridge(guild, DAL);
        bridge.init();
        this.sessions.set(guild.id, bridge);
    }

    _setEvents() {
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}, id ${this.client.user.id}!`);
            
            this._initSessions();
        });
          
        this.client.on(
            "messageCreate", msg => this._onMessageCreate(msg)
        );

        this.client.on(
            "guildCreate", guild => this._initSession(guild)
        );
    }

    init() {
        if (this.isDev) {
            this.client.login(config.TOKEN_DEV);
        } else {
            this.client.login(config.TOKEN_PROD);
        }

        this._setEvents();
    }

}

module.exports = InstanceManager;

