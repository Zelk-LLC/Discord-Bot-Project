const { SlashCommandBuilder,PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { getItem, addItem, getRolePermission } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-item')
		.setDescription('Provides you with a list of purchesable items.')
        .addIntegerOption(option =>
			option.setName("max-per-user")
			.setDescription("Maximum amount of this item user can have.")
			.setMinValue(1)
			.setRequired(true))
        .addStringOption(option =>
            option.setName("name")
            .setDescription("Name of the item.")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("price")
            .setDescription("Price of the item.")
            .setMinValue(1)
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("quantity")
            .setDescription("How much of the item is in stock.")
            .setMinValue(1)
            .setRequired(true))
        .addStringOption(option =>
            option.setName("type")
            .setDescription("type/rarity of the item.")
            .setRequired(true)),
		
	async execute(interaction) {
        const maxPerUser = interaction.options.getInteger('max-per-user');
        const name = interaction.options.getString('name');
        const price = interaction.options.getInteger('price');
        const quantity = interaction.options.getInteger('quantity')
        const type = interaction.options.getString('type')

        // Check if the users role has the permission to use this command
        const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'add-item');
        if(!hasPermission){
            return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
        }

        const item = await getItem(name);
       //if item already exists
        if(item != undefined){
            return interaction.reply("Item already exists.");
        }

        addItem(maxPerUser,name, price, quantity, type);
        interaction.reply(`Item ${name} has been added.`);
    }
};