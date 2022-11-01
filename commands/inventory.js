const {SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const {EmbedBuilder} = require('discord.js');
const {getUser,getInventory} = require('../Data/FirebaseContext.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription("View your inventory."),

    async execute(interaction){
        const embeds = [];
        const pages = {};
        const inventory = await getInventory(interaction.user.id);
        const pageCountMax = Math.ceil(inventory.docs.length / 25);

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
        console.log(embeds);

        const getRow = (id) => {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(pages[id] == 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(pages[id] == pageCountMax - 1),
                );
            return row;
        }

        const id = interaction.user.id;

        pages[id] = pages[id] || 0;

        const embed = embeds[pages[id]];

        interaction.reply({embeds: [embed], components: [getRow(id)]});

        let collector = interaction.channel.createMessageComponentCollector({filter: (i) => i.user.id === interaction.user.id, time: 60000});

        collector.on('collect', async (i) => {
            if(i.customId == 'prev'){
                pages[id]--;
            }else if(i.customId == 'next'){
                pages[id]++;
            }

            const embed = embeds[pages[id]];

            await i.update({embeds: [embed], components: [getRow(id)]});
        });
    }
};
