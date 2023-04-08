// https://github.com/discordjs/discord-api-types/blob/main/rest/v10/index.ts
// https://discord.com/developers/docs/interactions/message-components
import {MessageButtonStyles} from './ButtonStyles.js';

export class Button {
    /** @type {MessageButtonStyles} */
    style;

    /** @type {String} */
    label;

    /** @type {{name: String, id: String, animated: Boolean}} */
    emoji;

    /** @type {String} */
    custom_id;

    /** @type {String} */
    url;

    /** @type {String} */
    label;

    /** @type {Boolean} */
    disabled;

    toObj() {
        var obj = {type: 2};
        for (const i in this) {
            obj[i] = this[i];
        }
        return obj;
    }
    
    constructor() {}
}