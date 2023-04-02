import author from '../messages/User.js';
import Guild from './Guild.js'
import { Channel } from '../messages/message.js';
import axios from 'axios';


export default class invite {
    #token;

    code;

    /** @type {Guild} */
    guild;

    /** @type {Channel?} */
    channel;

    /** @type {member?} */
    inviter;

    /** @type {EpochTimeStamp} */
    expires_at;

    /** @type {Number} */
    uses;

    /** @type {Number} */
    max_uses;

    /** @type {Number} */
    max_age;

    /** @type {Boolean} */
    temporary;

    /** @type {String} */
    created_at;

    async delete() {
        return new Promise(async (resolve) => {
            try {
                const headers = { Authorization: this.#token }
                const response = await axios.delete(`https://discord.com/api/invites/${this.code}`, { headers });
                resolve(response.data);
            } catch (err) {
                throw err.data;
            }
        });
    }

    constructor(o, guild, token) {
        this.#token = token;
        for (const k in this) {
            if (o[k]) {
                if (k == 'guild') { this.guild = guild }
                // else if (k == 'channel') { this.channel = this.guild.channels.cache?.get(o[k]['id']); }
                else if (k == 'inviter') { this.inviter = new author(o[k]); }
                else { this[k] = o[k]; }
            } else { this[k] = 0; }
        }
    }
}