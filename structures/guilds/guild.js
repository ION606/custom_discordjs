const axios = require('axios');
const member = require('./member.js');
const guildRole = require('./guildRoles.js');
const GuildEmoji = require('./guildEmoji.js');
const { Channel } = require('../messages/message.js');

//See https://discord.com/developers/docs/resources/guild

class Guild {

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

    /** @type {member[]} */
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

    /** @type {guildRole[]} */
    roles;

    /** @type {String} */
    banner;

    /** @type {String} */
    application_id;

    /** @type {String} */
    owner_id;

    /** @type {Map<String, Channel>} */
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
    stage_instances

    
    async #getChannels(token) {
        const config = {
            headers: {
                Authorization: token
            }
        }

        const response = await axios.get(`https://discord.com/api/guilds/${this.id}/channels`, config);
        
        for (const channel of response.data) {
            if (channel.type == 4) continue;
            this.channels.set(channel.id, new Channel(token, channel.id));
        }
    }

    constructor(o, token) {
        this.members = new Map();
        this.channels = new Map();
        this.roles = [];
        this.stickers = [];

        for (const field in this) {
            if (o[field] == undefined || field == "channels") continue;

            if (field == 'members') {
                for (const m of o[field]) {
                    const mem = new member(m);
                    this.members.set(mem.user.id);
                }
            }
            else if (field == 'roles') {
                for (const r of o[field]) {
                    this.roles.push(new guildRole(r));
                }
            }
            else {
                this[field] = o[field];
            }
        }

        this.#getChannels(token);
    }
}



module.exports = Guild;