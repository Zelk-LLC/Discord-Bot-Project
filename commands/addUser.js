const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { getUser, addUser } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-user')
		.setDescription("Adds a user to the database if they don't already exist within it")
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
			.addIntegerOption(option =>
				option.setName("initial-bal-int")
			.setDescription("User's initial Balance.")
			.setRequired(true))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		
	async execute(interaction) {
		const userId = interaction.options.getUser("user-tag").id;
		const initialBalance = interaction.options.getInteger("initial-bal-int")

		const user = await getUser(userId);
		if(user == undefined){
			// User does not exist in the database
			// Add them to the database
			addUser(userId, initialBalance);
			// Send a message to the user that they have successfully been added.
			VerificationString = `User ${interaction.options.getUser('user-tag').username} has been added to the database with an initial balance of ${initialBalance} scrip.`;
			interaction.reply(VerificationString);
		}
		else{
			// User already exists in the database
			// Send a message to the user that they have already been added.
			VerificationString = `User ${interaction.options.getUser('user-tag').username} already exists in the database.`;
			interaction.reply(VerificationString);
		}
	}
};


	