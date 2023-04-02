import { Interaction } from '../structures/types.js';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/** @param {Interaction} interaction */
export default async (interaction) => {
    interaction.reply({content: "HELLO WORLD", ephemeral: true});
    await delay(3000);
    interaction.update({content: "NOOOOOOOOOOOOOOOOOO"});
    await delay(2000);
    const response = await interaction.followUp("followup!");
    await delay(2000);
    response.delete();
}