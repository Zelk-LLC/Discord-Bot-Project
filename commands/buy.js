const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { updateBalance, getUser, getItem, addItemToUser } = require('../Data/FirebaseContext.js');

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
            return interaction.reply("You don't have an account. Please use /register to create one.");
        }
        
        if(itemData == undefined){
            return interaction.reply(`Item ${item} doesn't exist.`);
        }

        if(itemData.docs[0].data().quantity <= 0){
            return interaction.reply(`Item ${item} is out of stock.`);
        }
        // Check if the user already has the max amount of items

        // get the subcollection inventory from user
        const userInventory = await db.collection('users').doc(user.docs[0].id).collection('inventory').where('name', '==', item).get()
        // if the user already has the item, update the quantity
        if (!userInventory.empty) {
            if(userInventory.docs[0].data().owned >= itemData.docs[0].data().maxPerUser){
                return interaction.reply(`You already have the max amount of ${item}.`);
            }
        }

        if(user.docs[0].data().balance < itemData.docs[0].data().price){
            return interaction.reply("You don't have enough scrip to complete this transaction.");
        }

        await addItemToUser(interaction.user.id, item);
        updateBalance(interaction.user.id, -itemData.docs[0].data().price);

        interaction.reply(`You have bought ${item} for ${itemData.docs[0].data().price} scrip.`);
    }
};
