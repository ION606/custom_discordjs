import author from '../messages/User.js';
import Guild from './Guild.js'
import { Channel } from './Channel.js';
import axios from 'axios';
import { DataManager } from '../DataManager.js';


export default class invite extends DataManager {
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
                const response = await this.client.axiosCustom.delete(`/invites/${this.code}`);
                resolve(response.data);
            } catch (err) {
                throw err.data;
            }
        });
    }

    constructor(o, guild, client) {
        super(client);
        
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