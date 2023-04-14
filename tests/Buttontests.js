import { Button } from "../structures/interactions/Button.js";
import { Channel } from "../structures/guilds/Channel.js";
import { message } from "../structures/messages/message.js";
import { MessageButtonStyles } from "../structures/interactions/ButtonStyles.js";
import { MessageActionRow } from "../structures/messages/MessageActionRow.js";
import { ChannelSelectMenu, StringMenuComponent, StringSelectMenu, userSelectMenu } from "../structures/interactions/MessageSelectMenu.js";

/**
 * @param {message} mog
 */
export async function buttonTests(mog) {
    var m = new message();
    // const comp = new Button();
    // comp.style = MessageButtonStyles.SUCCESS;
    // comp.label = "HELLO WORLD";
    // comp.custom_id = "temptemp";

    const c = new StringSelectMenu();
    const comp2 = new StringMenuComponent();
    comp2.value = 'llllll';
    comp2.label = 'llllll';
    c.options.push(comp2);
    c.custom_id = "temp";

    const comp3 = new userSelectMenu();
    comp3.custom_id = "userMenu";
    
    const row = new MessageActionRow();
    // row.addComponent(comp);
    // row.addComponent(c);
    row.addComponent(comp3);
    m.addComponents(row);
    m.content = "OOGA BOOGA";

    mog.reply(m);
}