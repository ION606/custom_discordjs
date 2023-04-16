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

    const btnSuccess = new Button();
    btnSuccess.style = MessageButtonStyles.SUCCESS;
    btnSuccess.label = "SUCCESS";
    btnSuccess.custom_id = "tempbtnsu";

    const btnDanger = new Button();
    btnDanger.style = MessageButtonStyles.DANGER;
    btnDanger.label = "HELLO WORLD";
    btnDanger.custom_id = "tempbtnda";

    const btnSecondary = new Button();
    btnSecondary.style = MessageButtonStyles.SECONDARY;
    btnSecondary.label = "HELLO WORLD";
    btnSecondary.custom_id = "tempbtnse";

    const btnPrim = new Button();
    btnPrim.style = MessageButtonStyles.PRIMARY;
    btnPrim.label = "HELLO WORLD";
    btnPrim.custom_id = "temppr";

    const btnLink = new Button();
    btnLink.style = MessageButtonStyles.LINK;
    btnLink.label = "HELLO WORLD";
    btnLink.url = 'https://www.google.com/';

    const row = new MessageActionRow();
    row.addComponent(btnSuccess);
    row.addComponent(btnDanger);
    row.addComponent(btnSecondary);
    row.addComponent(btnPrim);
    row.addComponent(btnLink);
    m.addComponents(row);
    m.content = "OOGA BOOGA";

    mog.reply(m);
}