const { SlashCommandBuilder, PermissionFlagsBits, awaitReactions, EmbedBuilder, MessageReaction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('votetimeout')
		.setDescription('a command to time people out via democracy')
		.addUserOption(option =>
			option
				.setName('victim')
				.setDescription('The member to timeout')
				.setRequired(true))
		//.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) */
		.setDMPermission(false),

	async execute(interaction) {
		const victim = interaction.options.getMember('victim'); // user passed through as option
		const intiator = interaction.member;
		const botId = '1017482172980019301'; // bot id
		const check = `✅` ;
		const voteMax = 5;
        const {  options,user,guild,channel } = await interaction;

		if(victim.roles.cache.some(role => role.name === 'Purple Rose' || role.name === 'Autocrat' || role.name === 'BotAdminRole')){
			await interaction.reply(`You have no power here.`);
			await intiator.timeout((5 * 60 * 1000) - 100);
			console.log(`${intiator.displayName} got timed out for a coup`);
		}
		else{
			await interaction.deferReply();
			let embed = new EmbedBuilder()
				.setTitle(`Should ${victim.displayName} be timed out for 5 minutes`)
				.setColor('Random')
				.setDescription(`${voteMax} ${check}'s if they should be (not including the bots)`);

			let embedpass = new EmbedBuilder()
				.setTitle(`The Jury has spoken on ${victim.displayName}`)
				.setColor('Random')
				.setDescription(`They will be timed out`);

			let embedfail = new EmbedBuilder()
				.setTitle(`The Jury has spoken on ${victim.displayName}`)
				.setColor('Random')
				.setDescription(`They will not be timed out`);

			const message = await channel.send({embeds: [embed]});
		
			message.react(check); // react to embed with emoji


			await interaction.editReply(`Started vote to timeout`);
		
			const filter = (reaction, user) => {
				return reaction.emoji.name === check && user.id != botId; // should be checking for if users reacted with ✅ and that its not the bots reaction
			};

			message.awaitReactions({ filter: filter, max: voteMax, time: 30000, errors: ['time'] })
				.then(collected => console.log(`${victim.displayName} got timed out by vote`) + victim.timeout((5 * 60 * 1000) - 100) + message.edit({embeds: [embedpass]}) + message.reactions.removeAll())
				.catch(collected => {
					console.log(`After a minute, only ${collected.size} out of ${voteMax} reacted.`);
					message.edit({embeds: [embedfail]});
					message.reactions.removeAll();
				});
	   }	
	},
};