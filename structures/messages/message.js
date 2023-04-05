import author from './User.js';
import axios from 'axios';
import { Channel } from '../guilds/Channel.js';


export class message {
    /** @type {author} */
    author;

    /** @type {String} */
    channel_id;

    /** @type {Object[]} */
    mentions;
    
    /** @type {Object[]} */
    mention_roles;

    /** @type {Boolean} */
    mention_everyone;

    /** @type {message} */
    referenced_message;

    /** @type {String} */
    timestamp;

    /** @type {Boolean} */
    pinned;

    /** @type {Object} */
    member;

    /** @type {String} */
    id;

    /** @type {Object} */
    content;

    /** @type {Object[]} */
    attachments;

    /** @type {Object[]} */
    embeds;

    /** @type {Guild} */
    guild;

    /** @type {String} */
    guild_id;

    /** @type {Object} */
    type;

    /** @type {Channel} */
    channel;

    /** @type {String} */
    #token;


    /**
     * @param {String} content 
     * @returns {Promise<message>}
     */
    reply(inp) {
        return new Promise(async (resolve, reject) => {
            const refObj = {
                message_id: this.id,
                channel_id: this.channel.id,
                guild_id: this.guild_id,
                fail_if_not_exists: false //when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true
            }

            const toSend = (typeof inp == 'string') ? {content: inp} : inp;
            toSend['message_reference'] = refObj;

            resolve(await this.channel.send(toSend));
        });
    }


    delete() {
        return new Promise(async (resolve, reject) => {
            try {
                const config = {
                    headers: {
                        Authorization: this.#token
                    }
                  }
                const response = await axios.delete(`https://discord.com/api/channels/${this.channel.id}/messages/${this.id}`, config);
        
                resolve(response.data);
            } catch(err) {
                reject(err);
            }
            
        })
    }


    /**
     * @param {{content: String, embeds: [Object]} | String} inp
     */
    async edit(inp) {
        return new Promise(async (resolve, reject) => {
            const newMsg = (typeof inp == "string") ? {content: inp} : inp;

            const config = {
                headers: {
                    Authorization: this.#token
                }
            }
    
            axios.patch(`https://discord.com/api/channels/${this.channel.id}/messages/${this.id}`, newMsg, config).then((response) => {
                resolve(response.data);
            }).catch((err) => {
                reject(`REQUEST FAILED WITH CODE ${err.response.data.code} AND THE FOLLOWING REASON:\n${err.response.data.message}`);
            });
        });
    }


    /**
     * @param {Object} msgRaw
     */
    constructor(msgRaw, token, guild) {
        this.#token = token;
        this.guild = guild;

        for (const k in this) {
            if (msgRaw[k] != undefined) {
                if (k == 'type') {
                    this.type = (msgRaw['guild_id']) ? msgRaw[k] : 1;
                }
                else if (k == "author") {
                    this[k] = new author(msgRaw[k]);
                }
                else {
                    if (k == 'channel_id') {
                        this.channel = new Channel({id: msgRaw[k]}, this.guild, this.#token);
                    }

                    this[k] = msgRaw[k];
                }
            }
        }
    }
}


export {messageChannelTypes} from './messageChannelTypes.js';