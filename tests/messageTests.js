const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
import {message, Embed, messageChannelTypes} from '../structures/types.js';


/** @param {message} message */
export default async (message) => {
    if (message.type == messageChannelTypes.DM) {
        const embd = new Embed()
        .setTitle("hello world")
        .setDescription("dkjhfslkjdfhjldsjhfkzdjhflkdsjhfdsjhfkdsjf");
        
        const response = await message.channel.send({ content: "FDJHKSJDFHLKJDSHFLKJSDHFKDSJHFD", embeds: [embd] });
        console.log(response);
        await delay(2000);

        const response2 = await message.reply({content: `You said "${message.content}"!`, embeds: [embd]});
        console.log(response2);
        await delay(2000);

        const response3 = await response.edit("KAT");
        console.log(response3);
    } else {
        console.log(message);
    }
}