const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sum-player-balance')
		.setDescription("Adds or removes specified Ammount to user.")
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
			.addIntegerOption(option =>
				option.setName("ammount")
			.setDescription("ammount")
			.setRequired(true))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		
	async execute(interaction) {
		const userId = interaction.options.getUser("user-tag").id;
		const ammount = interaction.options.getInteger("ammount")
		db.collection("users")
		.where("discordId","==",userId)
		.get()
		.then((QuerySnapshot) =>{
			if(QuerySnapshot.empty){
				interaction.reply("That user does not exist in our database.")
			}
			else{
				QuerySnapshot.forEach((doc) => {
                    db.collection("users")
                    .doc(doc.id)
                    .update({
                        balance: doc.data().balance + ammount
                    }).then(() => {
                        VerificationString = `User ${interaction.options.getUser('user-tag').username} has recieved ${ammount} Scrip and now has a balance of ${doc.data().balance + ammount} Scrip.`
                        interaction.reply(VerificationString)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });	
                })
			}
			
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		});
	},
};