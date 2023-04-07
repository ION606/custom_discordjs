import axios from 'axios';
import { Channel } from './Channel.js';
import Guild from './Guild.js';
import { BaseStruct } from '../baseStruct.js';


export class GuildChannelManager extends BaseStruct {
    #token;

    /** @type {Guild} */
    guild;

    /** @type {Map<String, Channel>} */
    cache;

    /**
     * @returns {Promise<Channel>}
     * @param {{name: String, type: Number, topic: String, position: Number, parent_id: String}} channel 
     */
    create(channel) {
        return new Promise(async (resolve) => {
            try {
                if (!channel.name) throw "Please provide a channel name";

                const config = {
                    headers: {
                        Authorization: this.#token
                    }
                }
        
                const response = await axios.post(`https://discord.com/api/guilds/${this.guild.id}/channels`, channel, config);
                const newChannel = new Channel(response.data, this.guild, this.#token);
                this.cache.set(newChannel.id, newChannel);
                resolve(newChannel);
            } catch (err) {
                throw err;
            }
        });
    }


    /**
     * @description returns the deleted channel if successful
     * @param {String} cid 
     * @param {String} reason 
     * @returns {promise<Channel>}
     */
    async delete(cid, reason=null) {
        return new Promise(async (resolve) => {
            try {
                if (!this.cache.has(cid)) throw "This channel does not exist!";

                const config = {
                    headers: {
                        Authorization: this.#token
                    }
                }
        
                const response = await axios.delete(`https://discord.com/api/channels/${cid}`, config);
                const newChannel = new Channel(response.data, this.guild, this.#token);
                this.cache.delete(cid);
                resolve(newChannel);
            } catch (err) {
                throw err;
            }
        });
    }

    /**
     * @returns {Promise<Channel>}
     * @param {String} cid
     * @param {{name: String, Type: String, position: Number, topic: String, nsfw: Boolean, userLimit : Number, }} opts
     */
    async edit(cid, opts) {
        return new Promise(async (resolve) => {
            try {
                if (!this.cache.has(cid)) throw "This channel does not exist!";
                if (Object.keys(opts).length == 0) return resolve(this);
                
                const config = {
                    headers: {
                        Authorization: this.#token
                    }
                }
        
                const response = await axios.patch(`https://discord.com/api/channels/${cid}`, opts, config);
                const newChannel = new Channel(response.data, this.guild, this.#token);
                this.cache.set(newChannel.id, newChannel);
                resolve(newChannel);
            } catch (err) {
                throw err;
            } 
        });
    }

    constructor(token, guild, newCache) {
        super();
        
        this.#token = token;
        this.guild = guild;
        this.cache = newCache;
    }
}