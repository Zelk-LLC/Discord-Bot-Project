const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getInventory } = require('../Data/FirebaseContext.js');
const buttonPages = require('../Models/pagination.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription("View your inventory."),

    async execute(interaction){
        const embeds = [];
        const inventory = await getInventory(interaction.user.id);
        const pageCountMax = Math.ceil(inventory.docs.length / 25);
        
        if(pageCountMax == 0){
            return interaction.reply("You have no items in your inventory.");
        }

        for(let i = 0; i < pageCountMax; i++){
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Inventory')
                .setDescription('Here is a list of all the items you own.')
                .setTimestamp()
                .setFooter({text:`Page ${i + 1} of ${pageCountMax.toString()}`});
            const fields = [];
            for(let j = 0; j < 25; j++){
                if(inventory.docs[i * 25 + j] == undefined){
                    break;
                }
                fields.push({name: inventory.docs[i * 25 + j].data().name, value: `Owned: ${inventory.docs[i * 25 + j].data().owned}`});
            }

            embed.addFields(fields);
            embeds.push(embed);
        }
        
        buttonPages(interaction, embeds);
    }
};
