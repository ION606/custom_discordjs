import { DataManager } from "../DataManager.js";
import { Interaction } from "./interaction.js";
import {interactionOptionRaw} from "./interactionOptionRaw.js";

export class InteractionManager extends DataManager {
    /** @type {Map<String, interactionOptionRaw>} */
    #commands;

    /**
     * @param {String} name 
     */
    async delete(name) {
        if (!this.#commands.has(name)) return;
        const int = this.#commands.get(name);
        
        await this.client.axiosCustom.delete(`/applications/${this.client.id}/commands/${int.id}`);
        this.#commands.delete(name);

        return int;
    }

    /**
     * @param {{name: string, description: string, options: [interactionOptionRaw], type: number, dm_permission: false}} int 
     */
    async set(int) {
        const response = await this.client.axiosCustom.post(`/applications/${this.client.id}/commands`, int);
        this.#commands.set(int.name, response);
        return true;
    }

    /**
     * @description returns a map of <name, raw_interaction>
     */
    list() {
        return new Map(this.#commands);
    }

    constructor(data, client) {
        super(client);
        this.#commands = new Map();

        for (const commandRaw of data) {
            this.#commands.set(commandRaw.name, commandRaw);
        }
    }
}