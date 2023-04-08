
export class MessageActionRow {
    /** @type {Object[]} */
    components;

    addComponent(comp) {
        if (this.components.length > 5) throw "MAXIMUM SIZE REACHED!";
        this.components.push(comp);
    }

    toObj() {
        const o = {type: 1, components: []};
        for (const k of this.components) {
            o.components.push(k.toObj());
        }
        return o;
    }

    constructor() { this.components = []; }
}