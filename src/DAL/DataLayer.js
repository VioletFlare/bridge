const DB = require('./DB.js');
const mysql = require('mysql2');

class DataLayer {

    constructor() {

    }

    insertGuild(guildId, name) {
        DB.getConnection((err, connection) => {
            if (err) throw err;

            const escapedName = mysql.escape(name);

            const query = `
                INSERT INTO bridge_guilds
                    (id, name)
                VALUES
                    (${guildId}, ${escapedName})
               ON DUPLICATE KEY UPDATE
                    name = ${escapedName};
            `

            connection.query(query, (error, results, fields) => {
                connection.release();
                if (error) throw error;
            });
        });
    }

    updateConfiguration(channel) {
        DB.getConnection((err, connection) => {
            if (err) throw err;

            const channelName = mysql.escape(channel.name);

            const query = `
                INSERT INTO bridge_configs
                    (guild_id, channel_name, channel_id)
                VALUES
                    (${channel.guild.id}, ${channelName}, ${channel.id})
                ON DUPLICATE KEY UPDATE
                    channel_name = ${channelName},
                    channel_id = ${channel.id};
            `

            connection.query(query, (error, results, fields) => {
                connection.release();
                if (error) throw error;
            });
        });
    }

    getConfiguration(guildId) {
        return new Promise(
            (resolve, reject) => {
                DB.getConnection((err, connection) => {
                    if (err) throw err;
        
                    const query = `
                        SELECT * from bridge_configs
                        WHERE guild_id = ${guildId};
                    `
        
                    connection.query(query, (error, results, fields) => {
                        if (error) throw error;
                        connection.release();

                        if (results === undefined) {
                            reject(new Error("Results is undefined."))
                        } else {
                            resolve(results[0]);
                        }
                    });
                });
            }
        );
    }

    getAllowedChannels() {
        return new Promise(
            (resolve, reject) => {
                DB.getConnection((err, connection) => {
                    if (err) throw err;
        
                    const query = `
                        SELECT channel_id FROM bridge_configs;
                    `
        
                    connection.query(query, (error, results, fields) => {
                        if (error) throw error;
                        connection.release();

                        if (results === undefined) {
                            reject(new Error("Results is undefined."))
                        } else {
                            resolve(results);
                        }
                    });
                });
            }
        );
    }

}

module.exports = new DataLayer();