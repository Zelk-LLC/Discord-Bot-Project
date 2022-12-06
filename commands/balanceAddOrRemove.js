const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getRolePermission } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sum-player-balance')
		.setDescription("Adds or removes specified Amount to user.")
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
			.addIntegerOption(option =>
				option.setName("amount")
			.setDescription("amount")
			.setRequired(true)),
		
	async execute(interaction) {
		const userId = interaction.options.getUser("user-tag").id;
		const amount = interaction.options.getInteger("amount")

		// Check if the users role has the permission to use this command
        const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'sum-player-balance');
        if(!hasPermission){
            return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
        }

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
                        balance: doc.data().balance + amount
                    }).then(() => {
                        VerificationString = `User ${interaction.options.getUser('user-tag').username} has recieved ${amount} Scrip and now has a balance of ${doc.data().balance + amount} Scrip.`
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