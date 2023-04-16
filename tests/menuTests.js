import { Button } from "../structures/interactions/Button.js";
import { Channel } from "../structures/guilds/Channel.js";
import { message } from "../structures/messages/message.js";
import { MessageButtonStyles } from "../structures/interactions/ButtonStyles.js";
import { MessageActionRow } from "../structures/messages/MessageActionRow.js";
import { ChannelSelectMenu, RoleSelectMenu, StringMenuComponent, StringSelectMenu, userSelectMenu } from "../structures/interactions/MessageSelectMenu.js";

/**
 * @param {message} mog
 */
export async function createMenuTests(mog) {
    var m = new message();

    const sMenu = new StringSelectMenu();
    const stringComp = new StringMenuComponent();
    stringComp.value = 'llllll';
    stringComp.label = 'llllll';

    const stringComp2 = new StringMenuComponent();
    stringComp2.value = 'pppppp';
    stringComp2.label = 'pppppp';

    sMenu.data.push(stringComp);
    sMenu.data.push(stringComp2);
    sMenu.custom_id = "temp";
    sMenu.max_values = 2;

    const uMenu = new userSelectMenu();
    uMenu.custom_id = "userMenu";

    const cMenu = new ChannelSelectMenu();
    cMenu.custom_id = "channelMenu";
    
    const rMenu = new RoleSelectMenu();
    rMenu.custom_id = "roleMenu";
    
    const row = new MessageActionRow();
    row.addComponent(uMenu);
    m.addComponents(row);
    
    const row2 = new MessageActionRow();
    row2.addComponent(sMenu);
    m.addComponents(row2);
    
    const row3 = new MessageActionRow();
    row3.addComponent(rMenu);
    m.addComponents(row3);

    m.content = "OOGA BOOGA";
    mog.reply(m);
}


export async function handleMenuTests(menu) {

}