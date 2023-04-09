const Instance = require('./Instance.js');
const config = require('../config.js');
const Discord = require("discord.js");
const DAL = require("./DAL/DataLayer.js");
const WordFilter = require("./Services/WordFilter.js");
const ConsoleController = require('./Services/ConsoleController.js');

class InstanceManager {
    
    constructor() {
        this.isDev = process.argv.includes("--dev");
        this.client = new Discord.Client({ 
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']
        });

        this.sessions = new Map();
        this.wordFilter = new WordFilter();
        this.allowedChannelIds = {};
        this.consoleController = new ConsoleController(config, this.sessions);
    }

    _onMessageCreate(msg) {
        const guildId = msg.guild.id;
        const instance = this.sessions.get(guildId);
        const isChannelReadAllowed = this.allowedChannelIds[msg.channelId];

        msg.content = this.wordFilter.filter(msg.content);

        if (instance) {
            instance.onMessageCreate(msg)
        }

        if (isChannelReadAllowed) {
            this.sessions.forEach(
                instance => instance.sendMessage(msg)
            )
        }
    }

    _initSessions() {
        if (!this.sessions.size) {
            for (const [guildId, guild] of this.client.guilds.cache.entries()) {
                const instance = new Instance(guild, DAL);
                instance.init();
                this.sessions.set(guildId, instance);
            }
        }
    }

    _initSession(guild) {
        const instance = new Instance(guild, DAL);
        instance.init();
        this.sessions.set(guild.id, instance);
    }

    _setEvents() {
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}, id ${this.client.user.id}!`);
            
            this._initSessions();
            this.consoleController.init();
        });
          
        this.client.on(
            "messageCreate", msg => this._onMessageCreate(msg)
        );

        this.client.on(
            "guildCreate", guild => this._initSession(guild)
        );
    }

    _initAllowedChannelIds() {
        DAL.getAllowedChannels().then(allowedChannels => {
            allowedChannels.forEach(
                allowedChannel => {
                    const channelId = allowedChannel.channel_id;

                    this.allowedChannelIds[channelId] = true;
                } 
            )
        });
    }

    _setup() {
        this.wordFilter.init();
        this._initAllowedChannelIds();
    }

    init() {
        if (this.isDev) {
            this.client.login(config.TOKEN_DEV);
        } else {
            this.client.login(config.TOKEN_PROD);
        }

        this._setup();
        this._setEvents();
    }

}

module.exports = InstanceManager;

