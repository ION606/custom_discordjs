import axios from 'axios';
import member from './member.js';
import {guildRole, guildRoleManager, guildMemberRoleManager} from './guildRoles.js';
import GuildEmoji from './guildEmoji.js';
import guildInvite from './guildInvite.js';
import { guildSticker, guildStickerManager } from './GuildStickers.js';
import { GuildChannelManager } from './GuildChannelManager.js';
import { Channel } from './Channel.js';
import { ThreadManager } from './ThreadManager.js';
import { DataManager } from '../DataManager.js';
// import { inspect } from 'util';

//See https://discord.com/developers/docs/resources/guild

export default class Guild extends DataManager {
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

    /** @type {ThreadManager} */
    threads;

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

    
    async #getChannels() {
        const response = await this.client.axiosCustom.get(`/guilds/${this.id}/channels`);
        
        const m = new Map();
        for (const channel of response.data) {
            if (channel.type == 4) continue;
            m.set(channel.id, new Channel(channel, this, this.client));
        }

        this.channels = new GuildChannelManager(this.client, this, m);
    }


    async #getMembers(membersObj) {
        for (const m of membersObj) {
            var tempRoles = [];
            for (const rid of m["roles"]) {
                tempRoles.push(this.roles.cache.get(rid));
            }

            const roleTemp = new guildMemberRoleManager(tempRoles, m["user"]["id"], this.client);
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
            const response = await this.client.axiosCustom.get(`/guilds/${this.id}/invites`);
            const invites = [];
            for (const i of response.data) {
                invites.push(new guildInvite(i, this, this.client));
            }

            resolve(invites);
        });
    }


    // toString() {
    //     return inspect(this, false, 1);
    // }


    /**
     * @param {Object} o 
     * @param {String} token 
     */
    constructor(o, client) {
        super(client);

        this.members = new Map();
        this.channels = new Map();
        this.stickers = [];

        for (const field in this) {
            if (o[field] == undefined || field == "channels" || field == "members") continue;

            if (field == 'roles') {
                var temp = [];
                for (const r of o[field]) {
                    temp.push(new guildRole(r));
                }
                this.roles = new guildRoleManager(temp, false, this.client);
                this.roles.guild = this;
            }
            else if (field == 'stickers') {
                this.stickers = new guildStickerManager(this, o[field], this.client);
            }
            else if (field == 'threads') {
                this.threads = new ThreadManager(o[field], this, this.client);
            }
            else {
                this[field] = o[field];
            }
        }

        this.#getMembers(o["members"]);
        this.#getChannels();
    }
}
