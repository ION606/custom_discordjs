import { Modal } from "./Modal.js";
import { Interaction } from "./interaction.js";
import { interactionTypes } from "./interactionTypes.js";
import * as msgMenu from './MessageSelectMenu.js';

/* inp.data
{ values: [ 'llllll' ], custom_id: 'temp', component_type: 3 }

{
  values: [ '720349017829015633' ],
  resolved: {
    users: { '720349017829015633': [Object] },
    members: { '720349017829015633': [Object] }
  },
  custom_id: 'userMenu',
  component_type: 5
}
*/


function createSelectMenu(inp, client) {
    // console.log(inp.data);//.filter(o => o.type in msgMenu.SelectMenuTypes);
    switch (inp.data.component_type) {
        case msgMenu.SelectMenuTypes.CHANNELS:
            return new msgMenu.ChannelSelectMenu(inp.data, client);

        case msgMenu.SelectMenuTypes.MENTIONABLE:
            throw "MENTIONABLE MENUS NOT CURRENTLY SUPPORTED";

        case msgMenu.SelectMenuTypes.ROLE:
            return new msgMenu.RoleSelectMenu(inp.data, client);

        case msgMenu.SelectMenuTypes.TEXT:
            return new msgMenu.StringSelectMenu(inp.data, client);

        case msgMenu.SelectMenuTypes.USER:
            return new msgMenu.userSelectMenu(inp.data);
        
        default: console.log("DEFAULT", inp.data);
    }
}


export function createInteraction(intRaw, client) {
    switch (intRaw.type) {
        case interactionTypes.ApplicationCommand:
            return new Interaction(intRaw, client);
        
        case interactionTypes.MessageComponent:
            return createSelectMenu(intRaw, client);

        case interactionTypes.ModalSubmit:
            return console.log("MODALS NOT FULLY IMPLEMENTED!");
            // return new Modal(intRaw, client);

        case interactionTypes.Ping:
            console.log("pong");
            return null;

        default: console.log(`UNKNOWN INTERACTION:\n`, intRaw);
    }
}