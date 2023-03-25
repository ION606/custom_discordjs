class guildRole {
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


module.exports = guildRole;