const { Client, gateWayIntents, message, Interaction } = require('../structures/types');
const { bottoken } = require('../config.json');


var c = new Client({
    intents: [
        gateWayIntents.Guilds,
        gateWayIntents.GuildMessages,
        gateWayIntents.GuildMessageReactions,
        gateWayIntents.GuildVoiceStates,
        gateWayIntents.GuildEmojisAndStickers,
        gateWayIntents.GuildPresences,
        gateWayIntents.GuildMembers,
        gateWayIntents.DirectMessages,
        gateWayIntents.DirectMessageReactions,
        gateWayIntents.DirectMessageTyping,
        gateWayIntents.MessageContent
    ]
});


c.login(bottoken);


c.on('messageRecieved', /**@param {message} message*/ async (message) => {
    require('./messageTests.js')(message);
});


c.on('interactionRecieved', /** @param {Interaction} interaction*/ async (interaction) => {
    require('./interactionTests.js')(interaction);
});


c.on('guildCreate', async (guild) => {
    require('./guildTests.js')(c);
});


c.on('ready', () => {
    console.log("BOT ONLINE!");
});