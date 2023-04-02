export class BaseGuild {
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
}