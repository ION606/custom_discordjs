import axios from "axios";
import { Channel } from "./Channel.js";
import { DataManager } from "../DataManager.js";

export class Thread extends Channel {
    /** @type {Number} */
    total_message_sent;

    /** @type {{locked: Boolean, create_timestamp: String, auto_archive_duration: Number, archived: Boolean, archive_timestamp: String}} */
    thread_metadata;

    /** @type {Number} */
    message_count;


    constructor(o, guild, client) {
        super(o, guild, client);
        this.last_message_sent = o['total_message_sent'];
        this.thread_metadata = o['thread_metadata'];
        this.message_count = o['thread_metadata'];
    }
}


export class ThreadManager extends DataManager {
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
     * @param {String} name 
     */
    findByName(name) {
        return [...this.cache.values()].find(r => (r.name == name));
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
                if (!this.cache.has(thread.id)) throw "THREAD DOES NOT EXIST!";
        
                await this.client.axiosCustom.delete(`/channels/${thread.id}`);
                const newChannel = this.cache.get(thread.id);
                this.cache.delete(thread.id);
                resolve(newChannel);
            } catch (err) {
                throw err;
            }
        });
    }


    /**
     * @description returns the created thread if successful
     * @param {Thread} thread
     * @param {String} reason
     * @returns {promise<Channel>}
     */
    async create(thread, reason=null) {
        return new Promise(async (resolve) => {
            try {
                const ttemp = this.findByName(thread.name);
                if (ttemp && ttemp.parent_id == thread.parent_id) throw "THREAD ALREADY EXISTS!";

                const response = await this.client.axiosCustom.post(`/channels/${thread.parent_id}/threads`, thread.toObj());
                const newThread = new Thread(response.data);
                this.cache.set(newThread.id, newThread);
                resolve(newThread);
            } catch (err) {
                throw err;
            }
        });
    }


    /**
     * @description returns the created thread if successful
     * @param {Thread} thread
     * @param {String} reason
     * @returns {promise<Channel>}
     */
        async edit(thread, reason=null) {
            return new Promise(async (resolve) => {
                try {
                    if (!this.cache.has(thread.id)) throw "THREAD DOES NOT EXIST!";
    
                    const response = await this.client.axiosCustom.patch(`/channels/${thread.parent_id}/threads`, thread.toObj());
                    const newThread = new Thread(response.data);
                    this.cache.set(newThread.id, newThread);
                    resolve(newThread);
                } catch (err) {
                    throw err;
                }
            });
        }
    

    constructor(o, guild, client) {
        super(client);
        this.cache = new Map();

        for (const k of o) {
            const newThread = new Thread(k, guild, client);
            this.cache.set(newThread.id, newThread);
        }
    }
}