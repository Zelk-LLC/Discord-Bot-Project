const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getUser,getItem,getInventory,removeItemFromUser,getRolePermission } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeitem')
		.setDescription('Removes an Item from a players inventory.')
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
		.addStringOption(option =>
			option.setName("item-name")
			.setDescription("Item's name")
			.setRequired(true))
		.addIntegerOption(option =>
			option.setName("quantity")
			.setDescription("How much of the item will be removed from the inventory.")
			.setMinValue(1)
			.setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
		
	async execute(interaction) {
		//remove item from user's inventory
		const userId = interaction.options.getUser("user-tag").id;
		const itemName = interaction.options.getString("item-name");
		const quantity = interaction.options.getInteger("quantity");
		const user = await getUser(interaction.user.id);
		const item = await getItem(itemName);
		const inventory = await getInventory(userId);
		const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'remove-item');
		if(!hasPermission){
			return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
		}
		
		if(item == undefined){
			return interaction.reply({content: "This item does not exist.", ephemeral: true});
		}
		if(inventory.docs.length == 0){
			return interaction.reply({content: "This user has no items in their inventory.", ephemeral: true});
		}
		const itemInInventory = inventory.docs.find(doc => doc.data().name == itemName);
		if(itemInInventory == undefined){
			return interaction.reply({content: "This user does not have this item in their inventory.", ephemeral: true});
		}
		if(itemInInventory.data().owned < quantity){
			return interaction.reply({content: "This user does not have enough of this item in their inventory.", ephemeral: true});
		}
		await removeItemFromUser(userId, itemName, quantity);
		return interaction.reply({content: `${quantity} have been removed from this user's inventory.`, ephemeral: true});

		
	} // end of execute
};