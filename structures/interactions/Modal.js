import { MessageActionRow } from "../messages/MessageActionRow.js";
import { Interaction } from "./interaction.js";

/** @enum {number} */
export const textInputStyle = Object.freeze({
    Short: 1,
    paragraph: 2
});

export class ModalComponent {
    /** @type {String} */
    custom_id;

    /** @type {String} */
    label;

    /** @type {Boolean} */
    required;

    /** @type {number} */
    min_length;

    /** @type {number} */
    max_length;

    /** @type {textInputStyle} */
    style;

    /** @type {String} */
    value;

    /** @type {String} */
    placeholder;

    toObj() {
        if (this.style != 1 && this.style != 2) throw `MODAL TEXT INPUT STYLE MUST BE 1 OR 2 BUT WAS '${this.style}'`;
        const obj = {type: 4};
        for (const k in this) {
            if (this[k]) obj[k] = this[k];
        }
        return obj;
    }

    constructor(obj) {
        if (obj == undefined) return;
        
        for (const k in this) {
            if (obj[k] != undefined) {
                this[k] = obj[k];
            }
        }
    }
}


export class Modal extends Interaction {
    /** @type {String} */
    title;

    /** @type {String} */
    custom_id;

    /** @type {Map<String, ModalComponent>} */
    components;

    /**
     * @param {ModalComponent} c
     * @returns {Boolean} true is added false otherwise
     */
    addComponent(c) {
        if (!c || this.components.has(c.custom_id)) return true;
        this.components.set(c.custom_id, c);
    }

    /**
     * @description returns the Modal's components as a map of
     * 
     * `custom_id ==> input`
     * @returns {[{value: String, custom_id: String}]}
     */
    getComponents() {
        const m = new Map();
        for (const k of this.components) {
            m.set(k[0], k[1]);
        }
        return m;
    }

    /**
     * @description returns the component with the custom id specified
     * @param {String} cid
     * @returns {String}
     */
    getComponent(cid) {
        return this.components.get(cid).value;
    }

    toObj() {
        const obj = {title: this.title, custom_id: this.custom_id, components: []};
        for (const key in this.components) {
            const comp = this.components.get(key);
            const a = new MessageActionRow();
            a.addComponent(comp);
            obj.components.push(a.toObj());
        }
        return obj;
    }
    
    constructor(intRaw, client) {
        super(intRaw, client);
        this.components = new Map();

        if (!intRaw) return;

        for (const opt of intRaw.data.components) {
            const compRaw = opt.components[0];
            const comp = new ModalComponent(compRaw);
            this.components.set(comp.custom_id, comp.value);
        }
    }
}