import { interactionTypes } from '../structures/interactions/interactionTypes.js';
import { Interaction } from '../structures/types.js';
import { Modal, ModalComponent } from '../structures/interactions/Modal.js';
import { MessageActionRow } from '../structures/messages/MessageActionRow.js';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/** @param {Interaction} interaction */
export default async (interaction) => {
    if (interaction.type == interactionTypes.ApplicationCommand) {

        return interaction.deferReply();
        const m = new Modal(null, interaction.client);
        const c = new ModalComponent();
        c.custom_id = 'nonononononono';
        c.label = "hi";
        c.style = 1;

        const c2 = new ModalComponent();
        c2.custom_id = 'the_capital_letter_l';
        c2.label = "HELLO WORLD";
        c2.style = 1;

        m.custom_id = "temp";
        m.title = "TITLE HERE";

        m.addComponent(c);
        m.addComponent(c2);
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
    }
    else if (interaction.type == interactionTypes.ModalSubmit) {
        console.log(interaction.getComponents());
    }    
    else {
        console.log(interaction);
    }
}