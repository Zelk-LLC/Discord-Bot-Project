const { dbLog } = require('../Data/FirebaseContext.js');

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
async function Log(interaction) {
    // Get the command arguments to log
    var args = "";
    for(const subcommand of interaction.options.data) {
        args += `${subcommand.value}, `;
    }
    // Log to the database
    dbLog(interaction, args.replace(/,\s*$/, ""));

    const guild = await interaction.client.guilds.fetch('1034838314555031552');
    const channel = guild.channels.cache.get('1037462133996269588');
    channel.send(`[LOG] [${new Date().toLocaleTimeString()} EST] [${interaction.user.username}#${interaction.user.discriminator}] /${interaction.commandName} ${args.replace(/,\s*$/, "")}`);
}

module.exports = {
    Log
}