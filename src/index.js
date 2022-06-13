require('dotenv').config(); //initialize dotenv
const { DiscordProxy } = require("./classes/discordProxy");
const Discord = require('discord.js');
const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const discordProxy = new DiscordProxy(client, process.env.UNIMPORTANT_VIDEO_CHANNEL, process.env.IMPORTANT_VIDEO_CHANNEL);

client.login(process.env.CLIENT_TOKEN); //login bot using token