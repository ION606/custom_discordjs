import axios from 'axios';
import author from '../messages/User.js';
import { message } from '../messages/message.js';
import { Channel } from '../guilds/Channel.js';
import {Embed} from '../messages/embed.js';
import Guild from '../guilds/Guild.js';
import { DataManager } from '../DataManager.js';
import { Modal, ModalComponent } from './Modal.js';
import { MessageActionRow } from '../messages/MessageActionRow.js';


class interactionOptions {
    /** @type {String} */
    name;

    /** @type {Number} */
    type;

    /** @type {[{value: any, type: Number, name: String}]} */
    options;

    /** @type {Boolean} */
    focused;

    constructor(o) {
        for (const k in this) {
            if (o[k]) this[k] = o[k];
        }
    }
}

export class Interaction extends DataManager {
    /** @type {author} */
    user;

    /** @type {Number} */
    type;

    /** @type {String} */
    #token;

    /** @type {String} */
    id;

    /** @type {String} */
    channel_id;

    /** @type {Channel} */
    channel;
    
    /** @type {String} */
    application_id;

    /** @type {Guild} */
    guild;

    /** @type {String} */
    guild_id;

    /** @type {interactionOptions} */
    data;

    async deferReply() {
        try {
            await this.client.axiosCustom.post(`/interactions/${this.id}/${this.#token}/callback`, {
                type: 5
            });
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * @param {Modal} m 
     */
    async #sendModal(m) {
        const response = await this.client.axiosCustom.post(`/interactions/${this.id}/${this.#token}/callback`, {type: 9, data: m.toObj()});
        return response.data;
    }

    /**
     * @param {{content: String, ephemeral?: Boolean, embeds: [Embed]} | String} inp 
     * @returns {Promise<message>}
     */
    async reply(inp) {
        //Check for action row
        if (inp instanceof Modal) return await this.#sendModal(inp);

        return new Promise(async (resolve, reject) => {
            const toSend = (typeof inp == 'string') ? inp : inp.content;

            var embds = undefined;
            if (inp.embeds) {
                embds = [];
                for (const i of inp.embeds) {
                    embds.push(i.toJSON());
                }
            }

            const response = await this.client.axiosCustom.post(`/interactions/${this.id}/${this.#token}/callback`, {
                type: 4,
                data: {
                    content: toSend,
                    embeds: embds,
                    flags: (inp.ephemeral) ? (1 << 6) : undefined
                }
            });

            resolve(new message(response.data, this.client));
        });
    }


    async update(inp) {
        return new Promise(async (resolve, reject) => {
            try {
                const toSend = (typeof inp == 'string') ? inp : inp.content;

                var embds = undefined;
                if (inp.embeds) {
                    embds = [];
                    for (const i of inp.embeds) {
                        embds.push(i.toJSON());
                    }
                }

                const response = await this.client.axiosCustom.patch(`/webhooks/${this.client.id}/${this.#token}/messages/@original`, {
                    content: toSend,
                    embeds: embds,
                    flags: (inp.ephemeral) ? (1 << 6) : undefined
                });

                // const response = await axios.get(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}/messages/@original`, config);

                resolve(new message(response.data, this.client));
            } catch(err) {
                reject(err);
            }
        });
    }


    /**
     * @param {*} inp 
     * @returns {Promise<message>}
     */
    async followUp(inp) {
        return new Promise(async (resolve, reject) => {
            try {
                const toSend = (typeof inp == 'string') ? inp : inp.content;

                var embds = undefined;
                if (inp.embeds) {
                    embds = [];
                    for (const i of inp.embeds) {
                        embds.push(i.toJSON());
                    }
                }

                const response = await this.client.axiosCustom.post(`/webhooks/${this.client.id}/${this.#token}`, {
                    content: toSend,
                    embeds: embds,
                    flags: (inp.ephemeral) ? (1 << 6) : undefined
                });

                // const response = await axios.get(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}/messages/@original`, config);

                resolve(new message(response.data, this.client));
            } catch(err) {
                reject(err);
            }
        });
    }


    /**
     * @returns {Promise<Boolean>} Returns true if successful
     */
    async delete() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.client.axiosCustom.delete(`/webhooks/${this.client.id}/${this.#token}/messages/@original`);
                
                resolve(response.status == 204);
            } catch (err) {
                reject(err);
            }
        });
    }


    /**
     * @param {Object} intRaw
     */
    constructor(intRaw, client) {
        super(client);
        Object.defineProperty(this, 'guild', { enumerable: false });

        if (!intRaw) return;
        this.#token = intRaw["token"];

        for (const k in this) {
            if (intRaw[k] != undefined) {
                if (k == "user")  this[k] = new author(intRaw[k]);
                else if (k == 'data') {
                    this.data = new interactionOptions(intRaw[k]);
                } else {
                    if (k == 'channel_id') {
                        this.channel = new Channel(intRaw[k], this.guild, client);
                    }

                    this[k] = intRaw[k];
                }
            }
        }
    }
}