const { SlashCommandBuilder,PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { getItem, restockItem, getRolePermission } = require('../Data/FirebaseContext.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restock')
        .setDescription('Restocks an item.')
        .addStringOption(option =>
            option.setName("name")
            .setDescription("Name of the item.")
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName("quantity")
            .setDescription("How much of the item will be added to the stock.")
            .setMinValue(1)
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

        async execute(interaction) {
            const name = interaction.options.getString('name');
            const quantity = interaction.options.getInteger('quantity')
            console.log(quantity)
           

            const item = await getItem(name);
        
            const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'restock');
            if(!hasPermission){
                return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
            }

            if(item == undefined){
                return interaction.reply("Item does not exist.");
            }

            //if item exists
            const newQuantity = item.docs[0].data().quantity + quantity;
            console.log(item.docs[0].data().quantity)
            console.log(newQuantity)

            restockItem(name, newQuantity);
            interaction.reply(`${quantity} ${name} has been added to the stock.`);
        }
};
    

