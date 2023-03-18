const messageChannelTypes = require('./messageChannelTypes.js');


class message {
    

    /** @type {Object} */
    author;

    /** @type {Object} */
    channel_id;

    /** @type {Object[]} */
    mentions;

    /** @type {Object} */
    member;

    /** @type {String} */
    id;

    /** @type {Object} */
    content;

    /** @type {Object[]} */
    attachments;

    /** @type {String} */
    guild_id;

    /** @type {Object} */
    type;


    /**
     * @param {Object} msgRaw
     */
    constructor(msgRaw) {
        for (const k in this) {
            if (msgRaw[k] != undefined) {
                if (k == 'type') {
                    this.type = (msgRaw['guild_id']) ? msgRaw[k] : 1;
                } else {
                    this[k] = msgRaw[k];
                }
            }
        }       
    }
}


module.exports = { message, messageChannelTypes };