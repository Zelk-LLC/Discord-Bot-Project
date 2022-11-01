const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { updateBalance, getUser, getItem,addItemToUser } = require('../Data/FirebaseContext.js');

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
        const itemData = await getItem(item);
        if(user == undefined){
            return interaction.reply("You don't have an account.");
        }
        
        if(itemData == undefined){
            return interaction.reply("Item doesn't exist.");
        }
        if(itemData.docs[0].data().quantity <= 0){
            return interaction.reply("Item is out of stock.");
        }
        if(user.docs[0].data().balance < itemData.docs[0].data().price){
            return interaction.reply("You don't have enough scrip to complete this transaction.");
        }
     
        updateBalance(interaction.user.id, user.balance - itemData.price);

        interaction.reply(`You have bought ${item} for ${itemData.price} scrip.`);
    }
};
