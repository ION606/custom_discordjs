import axios from 'axios';
import { Channel } from './Channel.js';
import Guild from './Guild.js';
import { DataManager } from '../DataManager.js';


export class GuildChannelManager extends DataManager {
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
        
                const response = await this.client.axiosCustom.post(`/guilds/${this.guild.id}/channels`, channel);
                const newChannel = new Channel(response.data, this.guild, this.client);
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

                const response = await this.client.axiosCustom.delete(`/channels/${cid}`);
                const newChannel = new Channel(response.data, this.guild, this.client);
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
        
                const response = await this.client.axiosCustom.patch(`/channels/${cid}`, opts);
                const newChannel = new Channel(response.data, this.guild, this.client);
                this.cache.set(newChannel.id, newChannel);
                resolve(newChannel);
            } catch (err) {
                throw err;
            } 
        });
    }

    constructor(client, guild, newCache) {
        super(client);
        
        this.guild = guild;
        this.cache = newCache;
    }
}