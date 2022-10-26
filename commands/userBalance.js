const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

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
        db.collection("users")
        .where("discordId","==",userId)
		.get()
		.then((QuerySnapshot) =>{
			if(QuerySnapshot.empty){
				interaction.reply("That user does not exist in our database.")
			}
			else{
			QuerySnapshot.forEach((doc) => {    
				const exampleEmbed = new EmbedBuilder()
					.setColor([68, 41, 37])
					.setTitle('User Balance:')
					.setAuthor({name:interaction.options.getUser('user-tag').username, iconURL:interaction.options.getUser("user-tag").avatarURL()})
					.setDescription(`📟 Hello, ${interaction.user.username}, the user ${interaction.options.getUser("user-tag").username} has a total balance of ${doc.data().balance} Scrip.`)
					.setTimestamp()
					.setFooter({ text: 'Displays Script amount for given user.'});

					interaction.reply({embeds: [exampleEmbed]})
							})
						}
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		});
	
	

// inside a command, event listener, etc.
	},
};
