const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

async function buttonPages(interaction, pages, time = 60000) {

    // defer reply
    await interaction.deferReply();

    // no buttons if there is only one page
    if (pages.length === 1) {
        const page = await interaction.editReply({ 
            embeds: pages,
            compnents: [],
            fetchReply: true
        });
        return page;
    }

    let index = 0;
    // Buttons
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pages[index] == 0),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pages[index] == pages.length - 1),
        );

    

    const currentPage = await interaction.editReply({
        embeds: [pages[index]],
        components: [row],
        fetchReply: true
    });

    const collector = await currentPage.createMessageComponentCollector({
        componentType: ComponentType.BUTTON,
        time: time
    });

    collector.on('collect', async (i) => {
        if(i.user.id !== interaction.user.id) return i.reply({ content: 'You cannot use this button', ephemeral: true });
        await i.deferUpdate();

        if(i.customId === 'prev') {
            if(index > 0) index--;
        } else if(i.customId === 'next') {
            if(index < pages.length - 1) index++;
        }

        await currentPage.edit({
            embeds: [pages[index]],
            components: [row]
        });
        
        collector.resetTimer();
    });

    collector.on('end', async () => {
        await currentPage.edit({
            components: []
        });
    });
    return currentPage;
}

module.exports = buttonPages;