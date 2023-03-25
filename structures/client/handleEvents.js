const { exit } = require('process');
const gateWayEvents = require('../gateway/dispatch.js');
const { message } = require('../messages/message.js');
const Interaction = require('../interactions/interaction.js');
const Guild = require('../guilds/guild.js');


/**
 * @description Returns true if this is a READY event and false otherwise
 * @param {Object} msg
 * @returns {Promise<Boolean>}
 */
module.exports = async function handleEvents(msgObj, token, id) {
    return new Promise((resolve, reject) => {
        const op = msgObj["op"];
        const t = msgObj["t"];

        if (op == 10) return resolve({op: op, heartBeat: msgObj["d"]["heartbeat_interval"]});

        else if (op != 0) { resolve(false); }

        else if (t == gateWayEvents.Ready) {
            resolve({op: op, t: t, config: msgObj["d"]["user_settings"], profile: msgObj["d"]["user"]}); //, guilds: msgObj["d"]["guilds"]
        }
        else if (t == gateWayEvents.MessageCreate) {
            const msg = new message(msgObj["d"], token);
            resolve({op: op, t: t, message: msg});
        }
        else if (t == gateWayEvents.InteractionCreate) {
            resolve({op: op, t: t, interaction: new Interaction(msgObj["d"], token, id)});
        }
        else if (t == gateWayEvents.GuildCreate) {
            resolve({op: op, t: t, guild: new Guild(msgObj["d"], token)});
        }
        
        else {
            // console.log(t);
        }
    });
}