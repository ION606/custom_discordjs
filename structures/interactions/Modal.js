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

    /** @type {ModalComponent[]} */
    components;

    /**
     * @param {ModalComponent} c 
     */
    addComponent(c) {
        this.components.push(c);
    }

    toObj() {
        const obj = {title: this.title, custom_id: this.custom_id, components: []};
        for (const comp of this.components) {
            obj.components.push(comp.toObj());
        }
        return obj;
    }
    
    constructor(intRaw, client) {
        super(intRaw, client);
        this.components = [];

        if (!intRaw) return;

        // [ { value: 'nnnnnnnnnnnnn', type: 4, custom_id: 'nonononononono' } ]
        for (const opt of intRaw.data.components) {
            //These are nested
            // this.components.push(new ModalComponent());
        }
    }
}