import {client} from 'strife.js'
let guild = await client.guilds.fetch(process.env.GUILD_ID);
let channels = await guild.channels.fetch();
export default {
    channels: {
        modlogs: channels.find((x)=> x.name.includes('logs'))
    }
}