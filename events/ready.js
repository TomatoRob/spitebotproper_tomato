const { Client } = require("discord.js");

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const { ActivityType } = require('discord.js');
		
		client.user.setActivity('you sleep', { type: ActivityType.Watching });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
