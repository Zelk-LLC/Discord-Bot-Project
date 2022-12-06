const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getLogs } = require('../Data/FireBaseContext.js');
const buttonPages = require('../Models/pagination.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-log')
        .setDescription('Check a users latest commands')
        .addUserOption(Option =>
            Option.setName('user-tag')
            .setDescription("User's @")
            .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const embeds = [];
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
                .setTitle(`Logs for ${user.username}`)
                .setThumbnail(user.avatarURL())
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

        buttonPages(interaction, embeds);
    }
}