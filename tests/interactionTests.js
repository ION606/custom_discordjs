const { Interaction } = require('../structures/types');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = /** @param {Interaction} interaction */ async (interaction) => {
    interaction.reply({content: "HELLO WORLD", ephemeral: true});
    await delay(3000);
    interaction.update({content: "NOOOOOOOOOOOOOOOOOO"});
    await delay(2000);
    const response = await interaction.followUp("followup!");
    await delay(2000);
    response.delete();
}