const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { updateBalance, getUser, getItem } = require('../Data/FirebaseContext.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription("Buy a given item from the shop.")
        .addStringOption(option =>
            option.setName("item")
            .setDescription("Name of the item you want to buy.")
            .setRequired(true)),
    async execute(interaction){
        const item = interaction.options.getString('item');
        const user = await getUser(interaction.user.id);
        if(user == undefined){
            return interaction.reply("You don't have an account.");
        }
        const itemData = getItem(item);
        if(itemData == undefined){
            return interaction.reply("Item doesn't exist.");
        }
        if(itemData.quantity <= 0){
            return interaction.reply("Item is out of stock.");
        }
        if(user.balance < itemData.price){
            return interaction.reply("You don't have enough scrip to complete this transaction.");
        }
    }
};
