const Guild = require("../structures/guilds/guild");
const { Client } = require("../structures/types");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = /** @param {Client} c */ async (c) => {
    c.guilds.forEach(/** @param {Guild} guild */ (guild) => {
        console.log(guild);
    });
}