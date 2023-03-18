const { exit } = require('process');
const gateWayEvents = require('../gateway/dispatch.js');
const { message } = require('../messages/message.js');


/**
 * @description Returns true if this is a READY event and false otherwise
 * @param {Object} msg
 * @returns {Promise<Boolean>}
 */
module.exports = async function handleEvents(msgObj) {
    return new Promise((resolve, reject) => {
        const op = msgObj["op"];
        const t = msgObj["t"];

        if (op == 10) return resolve({op: op, heartBeat: msgObj["d"]["heartbeat_interval"]});

        if (op == 0 && t == gateWayEvents.Ready) {
            resolve({op: op, t: t, config: msgObj["d"]["user_settings"], profile: msgObj["d"]["user"] });
        } else if (t == gateWayEvents.MessageCreate) {
            const msg = new message(msgObj["d"]);
            resolve({op: op, t: t, message: msg});
        }
        
        else {
            // console.log(t);
        }
    });
}