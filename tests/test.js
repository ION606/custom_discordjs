import { Client, gateWayIntents, message, Interaction } from '../structures/types.js';
import config from '../config.json' assert { type: 'json' };
const { bottoken } = config;

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
    (await import('./messageTests.js')).default(message);
});


c.on('interactionRecieved', /** @param {Interaction} interaction*/ async (interaction) => {
    (await import('./interactionTests.js')).default(interaction);
});


c.on('guildCreate', async (guild) => {
    (await import('./guildTests.js')).default(c);
});


c.on('ready', () => {
    console.log("BOT ONLINE!");
});