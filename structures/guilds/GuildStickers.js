import axios from "axios";
import user from "../messages/User.js";
import Guild from "./Guild.js";
import { BaseStruct } from "../baseStruct.js";


export class guildSticker extends BaseStruct {
    #token;
    
    /** @type {String} */
    id;

    /** @type {String} */
    pack_id;

    /** @type {String} */
    name;

    /** @type {String} */
    description;

    /** @type {String}  */
    tags;

    /** @type {String} */
    asset;

    /** @type {Number} */
    type;

    /** @type {Number} */
    format_type;

    /** @type {Boolean} */
    available;

    /** @type {Guild} */
    guild;

    /** @type {user} */
    user;

    /** @type {Number} */
    sort_value;


    #construcorHelper(o) {
        for (const k in this) {
            if (o[k]) this[k] = o[k];
            else this[k] = 0;
        }
    }

    /**
     * @description modifies the guild sticker IN PLACE
     * @param {{name: String, description: String, tags: String}} params
     * @returns {Promise<Boolean>}
     */
    async modify(params) {
        return new Promise(async (resolve) => {
            const config = {
                headers: {
                    Authorization: this.#token
                }
            }

            const response = await axios.patch(`https://discord.com/api/guilds/${this.guild.id}/stickers/${this.id}`, params, config);
            this.#construcorHelper(response.data);

            resolve(true);
        });
    }

    async delete() {
        return new Promise(async (resolve) => {
            const config = {
                headers: {
                    Authorization: this.#token
                }
            }

            await axios.delete(`https://discord.com/api/guilds/${this.guild.id}/stickers/${this.id}`, config);

            resolve(true);
        });
    }

    constructor(o, guild, token) {
        this.#token = token;
        this.guild = guild;
        this.#construcorHelper(o);
    }
}


export class guildStickerManager {
    #token;

    /** @type {Map<String, guildSticker>} */
    cache;

    /** @type {Guild} */
    guild;
    
    /**
     * @description Creates the new stickers and adds it to cache
     * @returns {Promise<guildSticker>}
     * @param {{name: String, description: String, tags: String }} sticker 
     */
    async create(sticker) {
        //HOW DO YOU DEAL WITH FILES????????
        //see https://discord.com/developers/docs/reference#image-data maybe?
        return Promise.reject(undefined);
        return new Promise(async (resolve) => {
            if (!sticker.name || !sticker.description || !sticker.tags) return resolve(undefined);

            const config = {
                headers: {
                    Authorization: this.#token
                }
            }

            const response = await axios.post(`https://discord.com/api/guilds/${this.guild.id}/stickers/${this.id}`, config);

            resolve(new guildSticker(response.data));
        });
    }

    /**
     * @param {Guild} guild 
     * @param {Object[]} o 
     * @param {String} token 
     */
    constructor(guild, o, token) {
        this.guild = guild;
        this.#token = token;
        for (const stickerRaw of o) {
            const sticker = new guildSticker(stickerRaw);
            this.cache.set(sticker.id, sticker);
        }
    }
}