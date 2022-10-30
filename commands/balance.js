const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getUser } = require('../Data/FirebaseContext.js');

var balance
module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Provides you with your own personal balance.'),
		
	async execute(interaction) {

		const user = await getUser(interaction.user.id);
		if(user == undefined){
			return interaction.reply("You don't have an account. Please use /register to create one.");
		}
		balance = user.docs[0].data().balance;
		const balanceEmbed = new EmbedBuilder()
					.setColor([68, 41, 37])
					.setTitle('User Balance:')
					.setAuthor({name:interaction.user.username, iconURL:interaction.user.avatarURL()})
					.setDescription(`📟 Hello, ${interaction.user.username}, you have a total balance of ${balance} scrip.`)
					.setTimestamp()
					.setFooter({ text: 'Displays scrip amount for given user.'});
		interaction.reply({ embeds: [balanceEmbed] });
	} // end of execute
};
