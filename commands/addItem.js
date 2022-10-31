const { SlashCommandBuilder,PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

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
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		
	async execute(interaction) {
        const maxPerUser = interaction.options.getInteger('max-per-user');
        const name = interaction.options.getString('name');
        const price = interaction.options.getInteger('price');
        const quantity = interaction.options.getInteger('quantity')
        const type = interaction.options.getString('type')

        db.collection('items').add({
            maxPerUser: maxPerUser,
            name: name,
            price: price,
            quantity: quantity,
            type: type
        })
        .then(() =>{
            console.log('Document created succesfully.')
            interaction.reply('Item Added successfully.')
        })
    }
};