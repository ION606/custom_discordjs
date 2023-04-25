import { interactionTypes } from '../structures/interactions/interactionTypes.js';
import { Interaction } from '../structures/types.js';
import { Modal, ModalComponent } from '../structures/interactions/Modal.js';
import { MessageActionRow } from '../structures/messages/MessageActionRow.js';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/** @param {Interaction} interaction */
export default async (interaction) => {
    if (interaction.type == interactionTypes.ApplicationCommand) {
        console.log(interaction.data);

        const m = new Modal(null, interaction.client);
        const c = new ModalComponent();
        c.custom_id = 'nonononononono';
        c.label = "hi";
        c.style = 1;
        m.custom_id = "temp";
        m.title = "TITLE HERE";

        const a = new MessageActionRow();
        a.addComponent(c);
        m.addComponent(a);
        interaction.reply(m);
        return;

        interaction.reply({content: "HELLO WORLD", ephemeral: true});
        await delay(3000);
        interaction.update({content: "NOOOOOOOOOOOOOOOOOO"});
        await delay(2000);
        const response = await interaction.followUp("followup!");
        await delay(2000);
        response.delete();

        // interaction.client.commands.set({
        //     name: 'none',
        //     description: 'eheheheheh'
        // });
        // const delResp = await interaction.client.commands.delete('none');
        // console.log(delResp);
    } else {
        console.log(interaction);
    }
}