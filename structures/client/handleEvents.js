const { exit } = require('process');
const gateWayEvents = require('../gateway/dispatch.js');
const { message } = require('../messages/message.js');
const Interaction = require('../interactions/interaction.js');


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

        if (op == 0 && t == gateWayEvents.Ready) {
            resolve({op: op, t: t, config: msgObj["d"]["user_settings"], profile: msgObj["d"]["user"] });
        }
        else if (t == gateWayEvents.MessageCreate) {
            const msg = new message(msgObj["d"], token);
            resolve({op: op, t: t, message: msg});
        }
        else if (t == gateWayEvents.InteractionCreate) {
            resolve({op: op, t: t, interaction: new Interaction(msgObj["d"], token, id)});
        }
        
        else {
            // console.log(t);
        }
    });
}