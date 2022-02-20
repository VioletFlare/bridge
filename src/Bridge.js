class Bridge {

    constructor(guild, DAL) {
        this.prefix = "br";
        this.guild = guild;
        this.DAL = DAL;
        this.configuration = {};
    }

    init() {
        this.DAL.insertGuild(this.guild.id, this.guild.name);
        this.DAL.getConfiguration(this.guild.id).then(config => {
            if (config) {

            }
        });
    }

    _configure(channelName) {
      const matchingChannel = this.guild.channels.cache.find(channel => channel.name === channelName);
      this.DAL.updateConfiguration(matchingChannel);
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
              this._configure(splittedCommand[1]);
            break;
          }
        }
      }

    onMessageCreate(msg) {
        this._parseCommand(msg);
    }
}

module.exports = Bridge;