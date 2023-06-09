import axios from 'axios';
import {message} from '../messages/message.js';
import { DataManager } from '../DataManager.js';

export class Channel extends DataManager {
    /** @type {String} */
    id;

    /** @type {String} */
    name;

    /** @type {String} */
    last_message_id;

    /** @type {Number} */
    type;

    /** @type {Number} */
    position;

    /** @type {Number} */
    flags;

    /** @type {String} */
    parent_id;

    /** @type {import('../guilds/Guild.js').def} */
    guild;

    /** @type {[{id: String, type: String, allow: Number, deny: Number, allow_new: String, deny_nwe: String}]} */
    permission_overwrites;

    /** @type {Number} */
    rate_limit_per_user;

    /** @type {Boolean} */
    nsfw;


    async getChannelData() {
        const response = await this.client.axiosCustom.get(`/channels/${this.id}`);
        const channelData = response.data;
        
        for (const k in this) {
            if (channelData[k]) {
                this[k] = channelData[k];
            }
        }
    }


    constructor(channel, guild, client = null) {
        super(client);
        
        for (const k in this) {
            if (channel[k]) this[k] = channel[k];
        }

        this.guild = guild;
    }

    /**
     * @param {Object} inp 
     * @returns {Promise<message>}
     */
    async send(inp) {
        return new Promise(async (resolve) => {
            try {
                var embds = undefined;
                if (inp.embeds) {
                    embds = [];
                    for (const i of inp.embeds) {
                        embds.push(i.toJSON());
                    }
                }
    
                var toSend = (typeof inp == 'string') ? { content: inp } : structuredClone(inp);
                toSend["embeds"] = embds;
                toSend["message_reference"] = inp.message_reference || undefined;
                toSend = Object.fromEntries(Object.entries(toSend).filter((o) => o[1] != undefined));

                const response = await this.client.axiosCustom.post(`/channels/${this.id}/messages`, toSend);

                resolve(new message(response.data, this.client));
            } catch (err) {
                throw err;
            }
        });
    }


    /**
     * @returns {Promise<Map<String, message>}
    * @param {{name: String, around: String, after: String, limit: Number}} configs 
     */
    async getMessages(configs) {
        return new Promise(async (resolve) => {
            var strconf = "?";
            for (const i in configs) {
                strconf += `${i}=${configs[i]}&`;
            }

            const response = await this.client.axiosCustom.get(`/channels/${this.id}/messages${strconf}`);
            
            const msgMap = new Map();
            for (const msgKey in response.data) {
                const m = new message(response.data[msgKey], this.client, this.guild);
                msgMap.set(m.id, m);
            }
            resolve(msgMap);
        });
    }

    toObj() {
        var obj = {};
        for (const key in this) {
            if (key != 'guild' && key != 'client') {
                obj[key] = this[key];
            }
        }

        return obj;
    }
}