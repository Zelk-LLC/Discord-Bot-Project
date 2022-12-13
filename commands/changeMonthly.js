const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { changeMonthlyRate,getRolePermission } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changemonthly')
		.setDescription('Allows you to change the monthly rate.')
		.addRoleOption(option =>
			option.setName("role-tag")
				.setDescription("The role to change the monthly rate for.")
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName("amount")
				.setDescription("The amount to change the monthly rate to.")
				.setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
		
	async execute(interaction) {
		const role = interaction.options.getRole("role-tag");
		const amount = interaction.options.getInteger("amount");

		 // Check if the users role has the permission to use this command
		 const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'restock');
		 if(!hasPermission){
			 return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
		 }

		if(amount < 0){
			return interaction.reply({content: "You cannot set the monthly rate to a negative number.", ephemeral: true});
		}

		await changeMonthlyRate(role.id, amount);
		interaction.reply(`The monthly rate for ${role.name} has been changed to ${amount}.`);
	} // end of execute
};