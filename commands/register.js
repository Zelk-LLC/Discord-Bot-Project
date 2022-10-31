const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const { db } = require('../firebaseConfig.js');
const { addUser, getUser } = require('../Data/FirebaseContext.js');
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription("Registers you to the database if you're not already in it."),
		
	async execute(interaction) {
		const userId = interaction.user.id
		const initialBalance = 50
		
		const user = await getUser(userId);
		if(user == undefined){
			// User does not exist in the database
			// Add them to the database
			addUser(userId, initialBalance);
			// Send a message to the user that they have successfully been added.
			VerificationString = `Registration Complete! Welcome ${interaction.user.username} to the scrip economy! You have been given ${initialBalance} scrip.`;
			interaction.reply(VerificationString);
		}
		else{
			// User already exists in the database
			// Send a message to the user that they have already been added.
			VerificationString = `You are already registered ${interaction.user.username}!`;
			interaction.reply(VerificationString);
		}
	}
};
