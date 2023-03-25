class member {
    /** @type {Object} */
    user;

    /** @type {Object[]} */
    roles;

    /** @type {String} */
    premium_since;

    /** @type {Boolean} */
    pending;

    /** @type {String} */
    nick;

    /** @type {Boolean} */
    mute;

    /** @type {Strnig} */
    joined_at;

    /** @type {Number} */
    flags;

    /** @type {Boolean} */
    deaf;

    /** @type {String} */
    communication_disabled_until;

    /** @type {String} */
    avatar;

    constructor(o) {
        for (const k in this) {
            if (o[k]) {
                this[k] = o[k];
            }
        }
    }
}


module.exports = member;