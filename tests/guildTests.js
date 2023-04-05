import Guild from "../structures/guilds/Guild.js";
import { guildRole, newGuildRoleObj } from "../structures/guilds/guildRoles.js";
import { Client } from "../structures/types.js";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/** @param {Client} c */
export default async function temp(c)  {
    // c.guilds.forEach(/** @param {Guild} guild */ (guild) => {
    //     console.log(guild);
    // });

    const guild = c.guilds.get("930148608400035860");
    const member = guild.members.get("720349017829015633");
    // console.log(member.roles.cache);

    if (!member.roles.has('946610800418762792')) {
        const response = await member.roles.add('946610800418762792');
        // console.log(response);
    }

    const newRole = new newGuildRoleObj({
        name: 'newrole'
    });

    if (!guild.roles.findByName(newRole.name)) {
        const response2 = await guild.roles.create(newRole);
        // console.log(response2);
        await delay(2000);

        const response3 = await guild.roles.delete(response2);
        // console.log(response3);
    }

    const invites = await guild.getInvites();
    await delay(1000);

    //Delete any invite that's gonna expire
    for (const invite of invites) {
        if (invite.max_age != 0) {
            console.log(await invite.delete());
        }
    }

    const newChannel = await guild.channels.create({name: "temptemp"});
    await delay(1000);
    
    guild.channels.edit(newChannel.id, {name: "NEW-NAME!"});
    // const delConf = await guild.channels.delete(newChannel.id);
    // console.log(delConf);
}