import axios from "axios";
import user from "../messages/User.js";
import Guild from "./Guild.js";
import { DataManager } from "../DataManager.js";


export class guildSticker extends DataManager {    
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
            const response = await this.client.axiosCustom.patch(`/guilds/${this.guild.id}/stickers/${this.id}`, params);
            this.#construcorHelper(response.data);
            resolve(true);
        });
    }

    async delete() {
        return new Promise(async (resolve) => {
            await this.client.axiosCustom.delete(`/guilds/${this.guild.id}/stickers/${this.id}`);
            resolve(true);
        });
    }

    constructor(o, guild, client) {
        super(client);

        this.guild = guild;
        this.#construcorHelper(o);
    }
}


export class guildStickerManager extends DataManager{
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


            const response = await this.client.axiosCustom.post(`https://discord.com/api/guilds/${this.guild.id}/stickers/${this.id}`);

            resolve(new guildSticker(response.data));
        });
    }

    /**
     * @param {Guild} guild 
     * @param {Object[]} o 
     */
    constructor(guild, o, client) {
        super(client);        
        this.guild = guild;

        for (const stickerRaw of o) {
            const sticker = new guildSticker(stickerRaw);
            this.cache.set(sticker.id, sticker);
        }
    }
}