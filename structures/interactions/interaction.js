const axios = require('axios');
const author = require('../messages/author.js');
const { Channel, message } = require('../messages/message.js');
const Embed = require('../messages/embed.js');


class Interaction {
    /** @type {author} */
    user;

    /** @type {Number} */
    type;

    /** @type {String} */
    #token;

    /** @type {{token: String, id: String}} */
    #application;

    /** @type {String} */
    id;

    /** @type {String} */
    channel_id;

    /** @type {Channel} */
    channel;
    
    /** @type {String} */
    application_id;


    /**
     * @param {{content: String, ephemeral?: Boolean, embeds: [Embed]} | String} inp 
     * @returns {Promise<message>}
     */
    async reply(inp) {
        return new Promise(async (resolve, reject) => {
            const toSend = (typeof inp == 'string') ? inp : inp.content;

        const config = {
                headers: {
                    Authorization: this.#application.token
                }
            }

            var embds = undefined;
            if (inp.embeds) {
                embds = [];
                for (const i of inp.embeds) {
                    embds.push(i.toJSON());
                }
            }

            const response = await axios.post(`https://discord.com/api/interactions/${this.id}/${this.#token}/callback`, {
                type: 4,
                data: {
                    content: toSend,
                    embeds: embds,
                    flags: (inp.ephemeral) ? (1 << 6) : undefined
                }
            }, config);

            resolve(new message(response.data, this.#application.token));
        });
    }


    async update(inp) {
        return new Promise(async (resolve, reject) => {
            try {
                const toSend = (typeof inp == 'string') ? inp : inp.content;

                const config = {
                    headers: {
                        Authorization: this.#application.token
                    }
                }

                var embds = undefined;
                if (inp.embeds) {
                    embds = [];
                    for (const i of inp.embeds) {
                        embds.push(i.toJSON());
                    }
                }

                const response = await axios.patch(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}/messages/@original`, {
                    content: toSend,
                    embeds: embds,
                    flags: (inp.ephemeral) ? (1 << 6) : undefined
                }, config);

                // const response = await axios.get(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}/messages/@original`, config);

                resolve(new message(response.data, this.#application.token));
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

                const config = {
                    headers: {
                        Authorization: this.#application.token
                    }
                }

                var embds = undefined;
                if (inp.embeds) {
                    embds = [];
                    for (const i of inp.embeds) {
                        embds.push(i.toJSON());
                    }
                }

                const response = await axios.post(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}`, {
                    content: toSend,
                    embeds: embds,
                    flags: (inp.ephemeral) ? (1 << 6) : undefined
                }, config);

                // const response = await axios.get(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}/messages/@original`, config);

                resolve(new message(response.data, this.#application.token));
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
                const response = await axios.delete(`https://discord.com/api/webhooks/${this.#application.id}/${this.#token}/messages/@original`);
                
                resolve(response.status == 204);
            } catch (err) {
                reject(err);
            }
        });
    }


    /**
     * @param {Object} intRaw
     */
    constructor(intRaw, token, apid) {
        this.#application = {token: token, id: apid};
        this.#token = intRaw["token"];

        for (const k in this) {
            if (intRaw[k] != undefined) {
                if (k == "user")  this[k] = new author(intRaw[k]);

                else {
                    if (k == 'channel_id') {
                        this.channel = new Channel(this.#application.token, intRaw[k]);
                    }

                    this[k] = intRaw[k];
                }
            }
        }
    }
}


module.exports = Interaction;