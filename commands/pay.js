const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { updateBalance } = require( '../Data/FirebaseContext.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription("Pay a given amount to user from your own wallet.")
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("amount")
			.setDescription("amount")
			.setMinValue(1)
			.setRequired(true)),
				
		
	async execute(interaction) {
		const recipientID = interaction.options.getUser("user-tag").id;
		const senderID = interaction.user;
		const amount = interaction.options.getInteger("amount")
		
		// Make sure the user is not paying themselves
		if(recipientID == senderID){
			return interaction.reply("You can't pay yourself.");
		}

		// Query database to find user from the database.
		db.collection('users')
		.where("discordId","==", senderID)
		.get()
		.then((UserPaying)=>{
			// If user is not found in the database, then return.
			if(UserPaying.empty){
				interaction.reply("You do not exist in the database.");
			}else{
				// if the user is found, check if the user has enough balance to pay.
				UserPaying.forEach((doc)=>{
					if(doc.data().balance < amount){
						interaction.reply("You do not have enough Scrip to conduct this transaction.");
					}
					else{
						db.collection("users")
						.where("discordId","==",recipientID)
						.get()
						.then((Recipient) =>{
							if(Recipient.empty){
								interaction.reply("That user does not exist in our database.");
							}
							// Update balances of both users.
							updateBalance(recipientID, amount)
							.then(()=>{
								updateBalance(senderID, -amount);
								
								// Send a message to the user that they have successfully paid.
								VerificationString = `User ${interaction.options.getUser('user-tag').username} has been paid ${amount} scrip.`;
                        		interaction.reply(VerificationString);
							}); // end of updateBalance
						}) // end of Recipient
					} // end of else
				}) // end of UserPaying
			} // end of else
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		}); // end of db.collection
	}, // end of execute
};