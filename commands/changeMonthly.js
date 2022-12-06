const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getUser } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changemonthly')
		.setDescription('Provides you with your own personal balance.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
		
	async execute(interaction) {

		const user = await getUser(interaction.user.id);
		if(user == undefined){
			return interaction.reply("You don't have an account. Please use /register to create one.");
		}
		
        return;
	} // end of execute
};