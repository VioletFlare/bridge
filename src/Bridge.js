class Bridge {

    constructor(guild, DAL) {
        this.prefix = "br";
        this.guild = guild;
        this.DAL = DAL;
        this.configuration = {};
        this.channel = null;
    }

    init() {
        this.DAL.insertGuild(this.guild.id, this.guild.name);
        this.DAL.getConfiguration(this.guild.id).then(config => {
            if (config) {
              this.configuration.channel_id = config.channel_id;
              this.configuration.channel_name = config.channel_name;
              this.configuration.guild_id = config.guild_id;

              this.channel = this.guild.channels.cache.find(channel => channel.name === config.channel_name);
            }
        });
    }

    _configure(msg, channelName) {
      this.channel = this.guild.channels.cache.find(channel => channel.name === channelName);
      const shouldModifyConfiguration = msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR") && this.channel;

      if (shouldModifyConfiguration) {
        this.configuration.channel_id = this.channel.id;
        this.configuration.channel_name = this.channel.name;
        this.configuration.guild_id = this.channel.guildId;
  
        this.DAL.updateConfiguration(this.channel);
      }
    }

    _splitCommand(msg) {
        const indexOfFirstSpaceOccurrence = msg.content.indexOf(" ");
        const firstPartOfCommand = msg.content.substring(0, indexOfFirstSpaceOccurrence);
        const lastPartOfCommand = msg.content.substring(indexOfFirstSpaceOccurrence + 1, msg.content.length);
        const splittedCommand = [firstPartOfCommand, lastPartOfCommand];

        return splittedCommand;
    }

    _parseCommand(msg) {
        let splittedCommand = this._splitCommand(msg);
        splittedCommand = splittedCommand.filter(string => string !== "" && string !== " ");
        const prefix = splittedCommand[0] ? splittedCommand[0].toLowerCase() : "";
        
        if (prefix.includes(this.prefix)) {
          const commandNameSplitted = splittedCommand[0].split("/");
          const command = commandNameSplitted[1] ? commandNameSplitted[1].toLowerCase() : "";
    
          switch (command) {
            case "configure":
              this._configure(msg, splittedCommand[1]);
            break;
          }
        }
      }

    onMessageCreate(msg) {
      this._parseCommand(msg);
    }

    sendMessage(msg) {
      const shouldSendMessage = this.channel && this.guild.id != msg.guildId && !msg.author.bot;

      if (shouldSendMessage) {
        let username;

        if (msg.member.nickname) {
          username = msg.member.nickname;
        } else {
          username = msg.member.user.username;
        }

        let content = "";

        if (msg.attachments.size) {
          msg.attachments.forEach(attachment => {
            content += attachment.url + " ";
          })
        } else {
          content = msg.content;
        }

        this.channel.send(`[${username}@${msg.guild.name}]: ${content}`)
      }
    }
}

module.exports = Bridge;