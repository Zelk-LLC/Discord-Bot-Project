const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { updateBalance, getUser } = require('../Data/FirebaseContext.js');

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

		const recipient = await getUser(recipientID);
		const sender = await getUser(senderID);
		
		if(sender == undefined){
			return interaction.reply("You don't have an account. Please use /register to create one.");
		}

		if(recipient == undefined){
			return interaction.reply("The user you are trying to pay does not have an account. Please have them use /register to create one.");
		}

		if(sender.docs[0].data().balance < amount){
			return interaction.reply("You don't have enough scrip to pay that amount.");
		}

		// User has enough scrip to pay the amount
		// Update the sender's balance
		updateBalance(senderID, -amount);
		// Update the recipient's balance
		updateBalance(recipientID, amount);

		// Send a message to the user that they have successfully paid.
		VerificationString = `User ${interaction.options.getUser('user-tag').username} has been paid ${amount} scrip.`;
		interaction.reply(VerificationString);
	} // end of execute
};