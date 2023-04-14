import { Modal } from "./Modal.js";
import { Interaction } from "./interaction.js";
import { interactionTypes } from "./interactionTypes.js";


function selectMenuTypes(inp) {
    
}

export function createInteraction(intRaw, client) {
    switch (intRaw.type) {
        case interactionTypes.ApplicationCommand:
            return new Interaction(intRaw, client);
        
        case interactionTypes.MessageComponent:
            console.log(intRaw.message.components);
            return null;

        case interactionTypes.ModalSubmit:
            return new Modal(intRaw, client);

        case interactionTypes.Ping:
            console.log("pong");
            return null;

        default: console.log(`UNKNOWN INTERACTION:\n`, intRaw);
    }
}