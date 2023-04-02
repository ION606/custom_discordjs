export default class user {
    /** @type {String} */
    id;

    /** @type {String} */
    username;

    /** @type {String} */
    global_name;

    /** @type {String} */
    display_name;

    /** @type {String} */
    avatar;
    
    /** @type {String} */
    avatar_decoration;

    /** @type {String} */
    discriminator;

    /** @type {Number} */
    public_flags;

    constructor(obj) {
        for (const k in this) {
            if (obj[k]) {
                this[k] = obj[k];
            }
        }
    }
}