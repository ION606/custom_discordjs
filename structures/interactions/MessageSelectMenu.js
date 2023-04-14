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
}

export const SelectMenuTypes = Object.freeze({
    TEXT: 3,
    USER: 5,
    ROLE: 6,
    MENTIONABLE: 7,
    CHANNELS: 8
});


class BaseSelectMenu {
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

    constructor(type) { this.#type = type; this.min_values = 1; this.max_values = 1; }
}

export class StringSelectMenu extends BaseSelectMenu {    
    /** @type {StringMenuComponent[]} */
    options;
    
    toObj() {
        const obj = super.toObj();
        obj["options"] = [];
        for (const k of this.options) {
            obj["options"].push(k.toJSON());
        }
        return obj;
    }

    constructor() { super(SelectMenuTypes.TEXT); this.options = []; }
}

export class ChannelSelectMenu extends BaseSelectMenu {
    /** @type { messageChannelTypes[] } */
    options;
    
    toObj() {
        const obj = super.toObj();
        obj["channel_types"] = [];
        for (const k of this.options) {
            obj["channel_types"].push(k);
        }
    }

    constructor() { super(SelectMenuTypes.CHANNELS); this.options = []; }
}


export class userSelectMenu extends BaseSelectMenu {
    constructor() { super(SelectMenuTypes.USER); }
}


export class RoleSelectMenu extends BaseSelectMenu {
    constructor() { super(SelectMenuTypes.ROLE); }
}


export class MentionableSelectMenu extends BaseSelectMenu {
    constructor() { super(SelectMenuTypes.MENTIONABLE); }
}