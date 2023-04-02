import axios from 'axios';
import {Channel} from '../messages/message.js';
import Guild from './Guild.js';

export class GuildChannelManager {
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


    constructor(token, guild, newCache) {
        this.#token = token;
        this.guild = guild;
        this.cache = newCache;
    }
}