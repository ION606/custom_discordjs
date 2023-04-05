import axios from 'axios';
import {message} from '../messages/message.js';

export class Channel {
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

    /** @type {String} */
    #token;


    async getChannelData() {
        const headers = {
            Authorization: this.#token
        }

        const response = await axios.get(`https://discord.com/api/channels/${this.id}`, { headers });
        const channelData = response.data;
        
        for (const k in this) {
            if (channelData[k]) {
                this[k] = channelData[k];
            }
        }
    }


    constructor(channel, guild, token = null) {
        this.#token = token;
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
            const toSend = (typeof inp == 'string') ? inp : inp.content;
            const config = {
                headers: {
                    Authorization: this.#token
                }
            }

            var embds = undefined;
            if (inp.embeds) {
                embds = [];
                for (const i of inp.embeds) {
                    embds.push(i.toJSON());
                }
            }

            const response = await axios.post(`https://discord.com/api/channels/${this.id}/messages`, {
                content: toSend,
                message_reference: inp.message_reference || undefined,
                embeds: embds
            }, config);

            resolve(new message(response.data, this.#token));
        });
    }


    /**
     * @returns {Promise<Map<String, message>}
    * @param {{name: String, around: String, after: String, limit: Number}} configs 
     */
    async getMessages(configs) {
        return new Promise(async (resolve) => {
            const config = {
                headers: {
                    Authorization: this.#token
                }
            }

            var strconf = "?";
            for (const i in configs) {
                console.log(i);
            }

            const response = await axios.get(`https://discord.com/api/channels/${this.id}/messages`, config);
            
            const msgMap = new Map();
            for (const msgKey in response.data) {
                const m = new message(response.data[msgKey], this.#token, this.guild);
                msgMap.set(m.id, m);
            }
            resolve(msgMap);
        });
    }

    toObj() {
        var obj = {};
        for (const key in this) {
            if (key != '#token' && key != 'guild') {
                obj[key] = this[key];
            }
        }

        return obj;
    }
}