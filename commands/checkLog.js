const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getLogs } = require('../Data/FireBaseContext.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-log')
        .setDescription('Check a users latest commands')
        .addUserOption(Option =>
            Option.setName('user-tag')
            .setDescription("User's @")
            .setRequired(true)),

    async execute(interaction) {
        const embeds = [];
        const pages = {};
        const user = interaction.options.getUser('user-tag');
        const userId = user.id;
        const logs = await getLogs(userId);
        const pageCountMax = Math.ceil(logs.docs.length / 5);

        if(pageCountMax == 0 ) {
            return interaction.reply("There are no logs to display for this user.");
        }

        for(let i = 0; i < pageCountMax; i++) {
            const embed =  new EmbedBuilder()
                .setColor("#0099ff")
                .setTitle("Logs")
                .setDescription(`Logs for user.`)
                .setTimestamp()
                .setFooter({text: `Page ${i + 1} of ${pageCountMax.toString()}`})
            const fields = [];
            for(let j = 0; j < 5; j++) {
                if(logs.docs[i * 5 + j] == undefined) break;
                fields.push({name: logs.docs[i * 5 + j].data().time.toDate().toDateString(), value: `${logs.docs[i * 5 + j].data().command} ${logs.docs[i * 5 + j].data().parameters}`})
            }
            embed.addFields(fields);
            embeds.push(embed);
        }

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

        const uid = interaction.user.id;

        pages[uid] = pages[uid] || 0

        const embed = embeds[pages[uid]];

        interaction.reply({embeds: [embed], components: [getRow(uid)]});

        let collector = interaction.channel.createMessageComponentCollector({filter: (i) => i.user.id === interaction.user.id, time: 60000});

        collector.on('collect', async (i) => {
            if(i.customId == 'prev'){
                pages[uid]--;
            }else if(i.customId == 'next'){
                pages[uid]++;
            }

            const embed = embeds[pages[uid]];

            await i.update({embeds: [embed], components: [getRow(uid)]});
        });
    }
}