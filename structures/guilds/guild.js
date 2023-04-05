import axios from 'axios';
import member from './member.js';
import {guildRole, guildRoleManager, guildMemberRoleManager} from './guildRoles.js';
import GuildEmoji from './guildEmoji.js';
import guildInvite from './guildInvite.js';
import { guildSticker, guildStickerManager } from './GuildStickers.js';
import { GuildChannelManager } from './GuildChannelManager.js';
import { Channel } from './Channel.js';

//See https://discord.com/developers/docs/resources/guild

export default class Guild {
    #token;

    //#region Vars
    /** @type {String[]} */
    embeded_activities;

    /** @type {String} */
    description;
    
    /** @type {String} */
    id;

    /** @type {String} */
    name;

    /** @type {String} */
    icon;
    
    /** @type {Boolean} */
    nsfw;

    /** @type {Map<String, member>} */
    members;

    /** @type {String} */
    hub_type;

    /** @type {Number} */
    max_video_channel_users;

    /** @type {String[]} */
    stickers;

    /** @type {String} */
    hub_type;

    /** @type {Map<String, member>} */
    members;

    /** @type {guildRoleManager} */
    roles;

    /** @type {String} */
    banner;

    /** @type {String} */
    application_id;

    /** @type {String} */
    owner_id;

    /** @type {GuildChannelManager} */
    channels;

    /** @type {String} */
    home_header;

    /** @type {Number} */
    premium_tier;

    /** @type {Number} */
    nsfw_level;

    /** @type {Number} */
    verification_level;

    /** @type {Number} */
    mfa_level;

    // /** @type {String} */    //FIXME
    // threads;

    /** @type {Number} */
    system_channel_flags;

    /** @type {String} */
    safety_alerts_channel_id;

    /** @type {object[]} */
    presences;

    /** @type {GuildEmoji[]} */
    emojis;

    /** @type {String} */
    public_updates_channel_id;

    /** @type {Object[]} */
    stage_instances;

    /** @type {String} */
    afk_channel_id;

    /** @type {Number} */
    afk_timeout;

    /** @type {Number} */
    verification_level;

    /** @type {Number} */
    default_message_notifications;

    /** @type {Number} */
    explicit_content_filter;

    /** @type {String} */
    system_channel_id;

    /** @type {Number} */
    system_channel_flags;

    /** @type {String} */
    rules_channel_id;

    /** @type {Number} */
    max_presences;

    /** @type {Number} */
    max_members;

    /** @type {String} */
    vanity_url_code;

    /** @type {Number} */
    premium_tier;

    /** @type {Number} */
    premium_subscription_count;

    /** @type {String} */
    preferred_locale;

    /** @type {String} */
    public_updates_channel_id;

    /** @type {Number} */
    max_video_channel_users;

    //Welcome screen
    //see https://discord.com/developers/docs/resources/guild#welcome-screen-object

    /** @type {guildStickerManager} */
    stickers;

    //#endregion

    
    async #getChannels(token) {
        const config = {
            headers: {
                Authorization: token
            }
        }

        const response = await axios.get(`https://discord.com/api/guilds/${this.id}/channels`, config);
        
        const m = new Map();
        for (const channel of response.data) {
            if (channel.type == 4) continue;
            m.set(channel.id, new Channel(channel, this, token));
        }

        this.channels = new GuildChannelManager(token, this, m);
    }


    async #getMembers(membersObj, token) {
        for (const m of membersObj) {
            var tempRoles = [];
            for (const rid of m["roles"]) {
                tempRoles.push(this.roles.cache.get(rid));
            }

            const roleTemp = new guildMemberRoleManager(tempRoles, m["user"]["id"], token);
            roleTemp.guild = this;
            const mem = new member(m, roleTemp);
            
            this.members.set(mem.user.id, mem);
        }
    }

    /**
     * @returns {Promise<guildInvite[]>}
     */
    getInvites() {
        return new Promise(async (resolve, reject) => {
            const config = {
                headers: {
                    Authorization: this.#token
                }
            }
    
            const response = await axios.get(`https://discord.com/api/guilds/${this.id}/invites`, config);
            const invites = [];
            for (const i of response.data) {
                invites.push(new guildInvite(i, this, this.#token));
            }

            resolve(invites);
        });
    }

    /**
     * @param {Object} o 
     * @param {String} token 
     */
    constructor(o, token) {
        this.members = new Map();
        this.channels = new Map();
        this.stickers = [];
        this.#token = token;

        for (const field in this) {
            if (o[field] == undefined || field == "channels" || field == "members") continue;

            if (field == 'roles') {
                var temp = [];
                for (const r of o[field]) {
                    temp.push(new guildRole(r));
                }
                this.roles = new guildRoleManager(temp, false, token);
                this.roles.guild = this;
            }
            else if (field == 'stickers') {
                this.stickers = new guildStickerManager(this, o[field], token);
            }
            else {
                this[field] = o[field];
            }
        }

        this.#getMembers(o["members"], token);
        this.#getChannels(token);
    }
}
