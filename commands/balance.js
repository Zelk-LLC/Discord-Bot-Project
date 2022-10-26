const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

var balance
module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Provides information about the server.'),
		
	async execute(interaction) {
        db.collection("users")
        .where("discordId","==",interaction.user.id)
		.get()
		.then((QuerySnapshot) =>{
			QuerySnapshot.forEach((doc) => {
				console.log(balance)
				const exampleEmbed = new EmbedBuilder()
					.setColor([68, 41, 37])
					.setTitle('User Balance:')
					.setAuthor({name:interaction.user.username, iconURL:interaction.user.avatarURL()})
					.setDescription(`📟 Hello, ${interaction.user.username}, you have a total balance of ${doc.data().balance} Scrip.`)
					.setTimestamp()
					.setFooter({ text: 'Displays Script amount for given user.'});

					interaction.reply({embeds: [exampleEmbed]})
							})
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		});

// inside a command, event listener, etc.
	},
};
