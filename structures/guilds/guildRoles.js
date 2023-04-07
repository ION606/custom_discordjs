import axios from 'axios';
import Guild from './Guild.js';
import { BaseStruct } from '../baseStruct.js';

// Maybe add support for this
// https://discord.com/developers/docs/resources/guild#modify-guild-role-positions


export class guildRole {
    /** @type {Number} */
    version;

    /** @type {String} */
    unicode_emoji;

    /** @type {Object} */
    tags;

    /** @type {Number} */
    position;

    /** @type {String} */
    permissions;

    /** @type {String} */
    name;

    /** @type {Boolean} */
    mentionable;

    /** @type {Boolean} */
    managed;

    /** @type {String} */
    id;

    /** @type {String} */
    icon;

    /** @type {Boolean} */
    hoist;

    /** @type {Number} */
    flags;

    /** @type {Number} */
    color;

    constructor(o) {
        for (const k in this) {
            if (o[k]) {
                this[k] = o[k];
            }
        }
    }
}

export class newGuildRoleObj {
    /** @type {String} */
    name;

    /** @type {WHAT} */
    permissions;

    /** @type {String} */
    color;

    /** @type {Boolean} */
    hoist;

    /** @type {WHAT} */
    icon;

    /** @type {String} */
    unicode_emoji;

    /** @type {Boolean} */
    mentionable;

    /**
     * @param {{ name: String, permissions?: any, color?: Number, hoist>: Boolean, icon?: String, unicode_emoji?: String, mentionable?: Boolean }} o 
     */
    constructor(o = undefined) {
        for (const f in this) {
            if (f in o) {
                this[f] = o[f];
            }
        }
    }

    toObj() {
        let obj = {};
        for (const f in this) {
            obj[f] = this[f];
        }
        return obj;
    }
}


export class guildMemberRoleManager extends BaseStruct {
    #uid;
    #token;

    /** @type {Guild} */
    guild;

    /** @type {Map<String, guildRole>} */
    cache;

    /**
     * @param {String | guildRole} role 
     */
    async remove(role) {
        return new Promise(async (resolve, reject) => {
            const rid = (typeof role == 'string') ? role : role.id;
            if (!this.cache.has(rid)) throw "USER DOESN'T HAVE THIS ROLE";

            const config = {
                headers: {
                    Authorization: this.#token
                }
            }

            this.cache.delete(rid);
            
            const response = await axios.delete(`https://discord.com/api/guilds/${this.guild.id}/members/${this.#uid}/roles/${rid}`, config);

            resolve(response);
        });
    }

    /**
     * @param {String | guildRole} role 
     * @returns { import('axios').AxiosResponse | String }
     */
    async add(role) {
        return new Promise(async (resolve, reject) => {
            const rid = (typeof role == 'string') ? role : role.id;
            const grole = this.guild.roles.cache?.get(rid)
            if (this.cache.has(rid)) throw "USER ALREADY HAS THIS ROLE";
            if (!grole) throw "ROLE NOT FOUND";

            const headers = { Authorization: this.#token }
            this.cache.set(rid, grole);
            
            const response = await axios.put(`https://discord.com/api/guilds/${this.guild.id}/members/${this.#uid}/roles/${rid}`, {}, { headers });

            resolve(response);
        });
    }

    /**
     * @param {String | guildRole} role 
     */
    has(role) {
        return this.cache.has(role);
    }

    /**
     * @param {Array<guildRole>} roles 
     * @param {String} uid UID or GuildId
     */
    constructor(roles, uid, token) {
        super();
        this.#token = token;
        this.#uid = uid;
        this.cache = new Map();
        roles.forEach((gr) => this.cache.set(gr.id, gr));
    }
}


export class guildRoleManager extends BaseStruct {
    #uid;
    #token;

    /** @type {Guild} */
    guild;

    /** @type {Map<String, guildRole>} */
    cache;

    /**
     * @param {String | guildRole} role 
     */
    has(role) {
        const rid = (typeof role == 'string') ? role : role.id;
        return this.cache.has(rid);
    }

    /**
     * @param {String} name 
     */
    findByName(name) {
        return [...this.cache.values()].find(r => (r.name == name));
    }

    /**
     * @param {newGuildRoleObj} role
     * @returns {Promise<guildRole>}
     */
    create(role) {
        return new Promise(async (resolve, reject) => {
            try {
                const mrole = [...this.cache.values()].find(r => (r.name == role.name));
                if (mrole) throw "ROLE ALREADY EXISTS!";
    
                const headers = { Authorization: this.#token }
                // this.cache.set(rid, grole);
                
                const response = await axios.post(`https://discord.com/api/guilds/${this.guild.id}/roles`, role.toObj(), { headers });
    
                const newRole = new guildRole(response.data);
                this.cache.set(newRole.id, newRole);
                resolve(newRole);
            } catch (err) {
                throw err;
            }
        });
    }


    /**
     * @description returns true if succeeded and throws error otherwise
     * @param {guildRole} role
     * @returns {Promise<Boolean>}
     */
    delete(role) {
        return new Promise(async (resolve, reject) => {
            try {
                const grole = this.guild.roles.cache?.get(role.id);
                if (!grole) throw "ROLE DOES NOT EXIST!";
    
                const headers = { Authorization: this.#token }
                // this.cache.set(rid, grole);
                
                const response = await axios.delete(`https://discord.com/api/guilds/${this.guild.id}/roles/${role.id}`, { headers });
                resolve(true);
            } catch (err) {
                throw err;
            }
        });
    }
    

    
    /**
     * @param {Array<guildRole>} roles 
     * @param {String} uid UID or GuildId
     */
    constructor(roles, uid, token) {
        super();
        this.#token = token;
        this.#uid = uid;
        this.cache = new Map();
        roles.forEach((gr) => this.cache.set(gr.id, gr));
    }
}