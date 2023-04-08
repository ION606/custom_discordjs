import gateWayEvents from '../gateway/dispatch.js'
import { message } from '../messages/message.js';
import {Interaction} from '../interactions/interaction.js';
import Guild from '../guilds/Guild.js';


/**
 * @description Returns true if this is a READY event and false otherwise
 * @param {Object} msg
 * @returns {Promise<Boolean>}
 */
export default async function handleEvents(msgObj, token, client) {
    return new Promise((resolve, reject) => {
        const op = msgObj["op"];
        const t = msgObj["t"];

        if (op == 10) return resolve({op: op, heartBeat: msgObj["d"]["heartbeat_interval"]});
        else if (op != 0) { return resolve(false); } // https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes

        switch(t) {
            case gateWayEvents.Ready:
                resolve({op: op, t: t, config: msgObj["d"]["user_settings"], profile: msgObj["d"]["user"]}); //, guilds: msgObj["d"]["guilds"]
                break;

            case gateWayEvents.MessageCreate:
                const msg = new message(msgObj["d"], client);
                resolve({op: op, t: t, message: msg});
                break;

            case gateWayEvents.InteractionCreate:
                resolve({op: op, t: t, interaction: new Interaction(msgObj["d"], client)});
                break;

            case gateWayEvents.GuildCreate:
                resolve({op: op, t: t, guild: new Guild(msgObj["d"], client)});
                break;

            case gateWayEvents.ThreadCreate:
                resolve({op: op, t: t, threadRaw: msgObj["d"]});
                break;
            
            case gateWayEvents.ThreadDelete:
                resolve({op: op, t: t, threadRaw: msgObj["d"]});
                break;

            case gateWayEvents.ThreadUpdate:
                resolve({op: op, t: t, threadRaw: msgObj["d"]});
                break;

            default: console.log(t);
        }
    });
}