class Instance {

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

              this.channel = this.guild.channels.cache.find(
                channel => {
                  const isCorrectChannel = channel.name === config.channel_name && channel.type === "GUILD_TEXT"

                  return isCorrectChannel;
                }
              );
            }
        });
    }

    _configure(msg, channelName) {
      this.channel = this.guild.channels.cache.find(
        channel => channel.name === channelName && channel.type === "GUILD_TEXT"
      );
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

    _getReplyMessageContent(referencedMessage, msg) {
      const referencedMessageWithNewline = `\n${referencedMessage.content}`;
      const transformedReferncedMessage = referencedMessageWithNewline.replaceAll("\n>", "\n>   ")
      const matchNewlineWithoutQuote = /\n(?!>)/g;
      const quotedReferencedMessage = transformedReferncedMessage.replaceAll(matchNewlineWithoutQuote, "\n> ");
      const replyMessage = `${quotedReferencedMessage}\n${msg.content}`;

      return replyMessage;
    }

    _getTextualContent(msg) {
      return new Promise(resolve => {
        if (msg.type === "REPLY") {
          msg.channel.messages
            .fetch(msg.reference.messageId)
            .then(
              referencedMessage => {
                const replyMessage = this._getReplyMessageContent(referencedMessage, msg);

                resolve(replyMessage)
              }
            ).catch(
              () => resolve("")
            )
        } else {
          resolve(msg.content);
        }
      });
    }

    _getMessageContent(msg) {
      return new Promise(resolve => {
        if (msg.attachments.size) {
          let content = "";

          msg.attachments.forEach(attachment => {
            content += attachment.url + " ";
          })

          resolve(content);
        } else {
          this._getTextualContent(msg).then(
            content => resolve(content)
          );
        }
      });
    }

    _getMessageRepresentation(msg, content) {
      let username;

      if (msg.member.nickname) {
        username = msg.member.nickname;
      } else {
        username = msg.member.user.username;
      }

      const messageRepresentation = 
        `[${username}@${msg.guild.name}]: ${content}`;

      return messageRepresentation;
    }

    sendMessage(msg) {
      const shouldSendMessage = this.channel && this.guild.id != msg.guildId && !msg.author.bot;

      if (shouldSendMessage) {
        this._getMessageContent(msg).then(content => {
          const messageRepresentation = this._getMessageRepresentation(msg, content);

          this.channel
            .send(messageRepresentation)
            .catch(
              error => console.error(error)
            )
        });
      }
    }
}

module.exports = Instance;