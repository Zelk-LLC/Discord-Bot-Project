const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getUser } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player-balance')
		.setDescription('Provides you with the balance of a player.')
        .addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true)),
		
	async execute(interaction) {
        const userId = interaction.options.getUser("user-tag").id;

		// Check if the users role has the permission to use this command
        const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'player-balance');
        if(!hasPermission){
            return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
        }

		const user = await getUser(userId);
		if(user == undefined){
			return interaction.reply("This user doesn't have an account. Please have them use /register to create one.");
		}
		balance = user.docs[0].data().balance;
		const balanceEmbed = new EmbedBuilder()
					.setColor([68, 41, 37])
					.setTitle('User Balance:')
					.setAuthor({name:interaction.options.getUser('user-tag').username, iconURL:interaction.options.getUser("user-tag").avatarURL()})
					.setDescription(`📟 Hello, ${interaction.user.username}, the user ${interaction.options.getUser("user-tag").username} has a total balance of ${balance} scrip.`)
					.setTimestamp()
					.setFooter({ text: 'Displays scrip amount for given user.'});
		interaction.reply({ embeds: [balanceEmbed] });
	} // end of execute
};