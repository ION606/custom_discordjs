import { Interaction } from "./interaction.js";


export class Modal extends Interaction {
    constructor(intRaw, client) {
        super(intRaw, client);
        console.log(intRaw);
    }
}