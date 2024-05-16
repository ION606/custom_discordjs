import author from './User.js';
import axios from 'axios';
import { Channel } from '../guilds/Channel.js';
import Guild from '../guilds/Guild.js';
import { DataManager } from '../DataManager.js';
import { MessageActionRow } from './MessageActionRow.js';


export class message extends DataManager {
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

    /** @type {MessageActionRow[]} */
    components;

    /**
     * @param {MessageActionRow} ar 
     */
    addComponents(ar) {
        if (this.components.length > 5) throw "MAXIMUM SIZE REACHED (5)";
        this.components.push(ar);
    }


    /**
     * @param {String | message} content 
     * @returns {Promise<message>}
     */
    reply(inp) {
        return new Promise(async (resolve, reject) => {
            try {
                const refObj = {
                    message_id: this.id,
                    channel_id: this.channel.id,
                    guild_id: this.guild_id,
                    fail_if_not_exists: false //when sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true
                }

                const toSend = (typeof inp == 'string') ? { content: inp } : structuredClone(inp);
                toSend['message_reference'] = refObj;

                if (inp.components) {
                    toSend["components"] = [];
                    for (const k of inp.components) {
                        toSend["components"].push(k.toObj());
                    }
                }

                resolve(await this.channel.send(toSend));
            } catch (err) {
                throw err;
            }
        });
    }


    async delete() {
        try {
            const response = await this.client.axiosCustom.delete(`/channels/${this.channel.id}/messages/${this.id}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    /**
     * @param {string} reaction 
     */
    async react(reaction) {
        this.axiosCustom.put(`/channels/${this.channel.id}/messages/${this.id}/reactions/${reaction}/@me`);
    }


    /**
     * @param {{content: String, embeds: [Object]} | String} inp
     */
    async edit(inp) {
        return new Promise(async (resolve, reject) => {
            const newMsg = (typeof inp == "string") ? { content: inp } : inp;

            if (this.components) {
                newMsg.components = [];
                for (const k of this.components) {
                    newMsg.components.push(k.toObj());
                }
            }

            this.client.axiosCustom.patch(`/channels/${this.channel.id}/messages/${this.id}`, newMsg).then((response) => {
                resolve(response.data);
            }).catch((err) => {
                reject(`REQUEST FAILED WITH CODE ${err.response.data.code} AND THE FOLLOWING REASON:\n${err.response.data.message}`);
            });
        });
    }


    /**
     * @param {Object} msgRaw
     */
    constructor(msgRaw, client, guild) {
        super(client);

        this.guild = guild;

        for (const k in msgRaw) {
            if (k == 'type') {
                this.type = (msgRaw['guild_id']) ? msgRaw[k] : 1;
            }
            else if (k == "author") {
                this[k] = new author(msgRaw[k]);
            }
            else {
                if (k == 'channel_id') {
                    this.channel = new Channel({ id: msgRaw[k] }, this.guild, client);
                }

                this[k] = msgRaw[k];
            }
        }

        if (this.components == undefined) this.components = [];
    }
}


export { messageChannelTypes } from './messageChannelTypes.js';