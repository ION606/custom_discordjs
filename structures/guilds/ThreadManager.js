import axios from "axios";
import { Channel } from "./Channel.js";

export class Thread extends Channel {
    /** @type {Number} */
    total_message_sent;

    /** @type {{locked: Boolean, create_timestamp: String, auto_archive_duration: Number, archived: Boolean, archive_timestamp: String}} */
    thread_metadata;

    /** @type {Number} */
    message_count;


    constructor(o, guild, token) {
        super(o, guild, token);
        this.last_message_sent = o['total_message_sent'];
        this.thread_metadata = o['thread_metadata'];
        this.message_count = o['thread_metadata'];
    }
}


export class ThreadManager {
    #token;
    /** @type {Map<String, Thread>} */
    cache;

    /**
     * @returns {Thread | Boolean} The deleted thread or false if the operation failed
     * @param {Thread | String} threadId
     */
    has(thread) {
        const tid = (typeof thread == 'string') ? thread : thread.id;
        if (!this.cache.has(tid)) return false;
        const threadToDel = this.cache.get(tid);
        this.cache.delete(tid);
        return threadToDel;
    }


    /**
     * @description returns the deleted thread if successful
     * @param {Thread} thread
     * @param {String} reason
     * @returns {promise<Channel>}
     */
async delete(thread, reason=null) {
    return new Promise(async (resolve) => {
        try {
            if (!this.cache.has(thread.id)) throw "This thread does not exist!";

            const config = {
                headers: {
                    Authorization: this.#token
                }
            }
    
            await axios.delete(`https://discord.com/api/channels/${thread.id}`, config);
            const newChannel = this.cache.get(thread.id);
            this.cache.delete(thread.id);
            resolve(newChannel);
        } catch (err) {
            throw err;
        }
    });
}



    constructor(o, guild, token) {
        this.cache = new Map();
        this.#token = token;

        for (const k of o) {
            const newThread = new Thread(k, guild, token);
            this.cache.set(newThread.id, newThread);
        }
    }
}