import { DataManager } from '../DataManager.js';
import { Client } from '../client/client.js';
import { Channel } from '../guilds/Channel.js';
import { guildRole } from '../guilds/guildRoles.js';
import member from '../guilds/member.js';
import user from '../messages/User.js';
import {messageChannelTypes} from '../messages/messageChannelTypes.js';


export class StringMenuComponent {
    /** @type {String} */
    label;

    /** @type {String} */
    value;

    /** @type {String} */
    description;

    /** @type {{id: String, name: String, animated: Boolean}} */
    emoji;

    /** @type {Boolean} */
    default;

    toJSON() {
        const obj = {};
        for (const k in this) {
            obj[k] = this[k];
        }
        return obj;
    }

    constructor(data = undefined) {
        if (!data) return;
        
        for (const k in this) {
            if (data[k]) this[k] = data[k];
        }
    }
}


export class userMenuComponent {
    /** @type {String[]} */
    values;

    /** @type {user[]} */
    users;

    /** @type {member[]} */
    members;
    
    constructor(data) {
        this.users = [];
        this.members = [];
        this.values = data["values"];
        const resolved = data['resolved'];

        const mems = resolved['members'];
        const usrs = resolved['members'];

        for (const k in usrs) {
            this.users.push(new user(usrs[k]));
        }

        for (const k in mems) {
            this.members.push(new member(mems[k], mems[k]['roles']));
        }
    }
}


/**
 * @enum {number}
 */
export const SelectMenuTypes = Object.freeze({
    TEXT: 3,
    USER: 5,
    ROLE: 6,
    MENTIONABLE: 7,
    CHANNELS: 8
});


class BaseSelectMenu extends DataManager {
    #type;
    
    /** @type {String} */
    custom_id;

    /** @type {Boolean} */
    disabled;

    /** @type {Number} */
    min_values;

    /** @type {Number} */
    max_values;

    /** @type {String} */
    placeholder;

    toObj() {
        if (!this.custom_id) throw "PLEASE ENTER A CUSTOM ID!";
        var obj = { type: this.#type };
        for (const k in this) {
            obj[k] = this[k];
        }

        return obj;
    }

    constructor(type, data = undefined, client = undefined) {
        super(client);
        this.#type = type;
        this.min_values = 1;
        this.max_values = 1;
        this.client = client;

        if (data) {
            for (const k in this) {
                if (data[k] != undefined) {
                    this[k] = data[k];
                }
            }
        }
    }
}


export class StringSelectMenu extends BaseSelectMenu {    
    /** @type {StringMenuComponent[] | String[]} */
    data;

    /** @type {Boolean} */
    isRet;
    
    toObj() {
        const obj = super.toObj();
        obj["options"] = [];
        for (const k of this.data) {
            obj["options"].push(k.toJSON());
        }
        return obj;
    }

    constructor(dataRaw = undefined, client = undefined) {
        super(SelectMenuTypes.TEXT, dataRaw, client);

        this.data = (dataRaw) ? dataRaw.values : [];
    }
}


export class ChannelSelectMenu extends BaseSelectMenu {
    /** @type { Channel[] } */
    data;
    
    toObj() {
        const obj = super.toObj();

        obj["channel_types"] = [];
        for (const k of this.data) {
            obj["channel_types"].push(k);
        }
        return obj;
    }

    constructor(dataRaw = undefined, client = undefined) {
        super(SelectMenuTypes.CHANNELS, undefined, client);
        if (dataRaw) {
            this.custom_id = dataRaw?.custom_id;
            this.data = [];
            
            for (const key in dataRaw.resolved.channels) {
                const channelRaw = dataRaw.resolved.channels[key];

                if (this.client.guilds.has(channelRaw.guild_id)) {
                    const guild = this.client.guilds.get(channelRaw.guild_id);
                    this.data.push(guild.channels.cache.get(key));
                }
            }

        } else this.data = []; //(dataRaw) ? [new loop through channels here(dataRaw)] : [];
    }
}


export class userSelectMenu extends BaseSelectMenu {
    /** @type {userMenuComponent[]} */
    data;

    constructor(dataRaw = undefined, client = undefined) {
        super(SelectMenuTypes.USER, dataRaw, client);
        if (dataRaw) {
            this.custom_id = dataRaw?.custom_id;
            this.data = [new userMenuComponent(dataRaw)];
        }
    }
}


export class RoleSelectMenu extends BaseSelectMenu {
    /** @type {Map<String, guildRole>} */
    data;

    constructor(dataRaw = undefined, client = undefined) {
        super(SelectMenuTypes.ROLE, dataRaw, client);
        this.data = new Map();

        if (dataRaw) {
            for (const key in dataRaw.resolved.roles) {
                this.data.set(key, new guildRole(dataRaw.resolved.roles[key]));
            }
        }
    }
}


export class MentionableSelectMenu extends BaseSelectMenu {
    constructor() { super(SelectMenuTypes.MENTIONABLE); }
}