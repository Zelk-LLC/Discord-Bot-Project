const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getInventory,getUser } = require('../Data/FirebaseContext.js');
const buttonPages = require('../Models/pagination.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('checkinventory')
		.setDescription('Check a player inventory.')
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
		
	async execute(interaction) {
		const userId = interaction.options.getUser("user-tag").id;
		const embeds = [];
        const inventory = await getInventory(userId);
        const pageCountMax = Math.ceil(inventory.docs.length / 25);
		const user = await getUser(interaction.user.id);

		const hasPermission = await getRolePermission(interaction.member.roles.cache.first().id, 'add-item');
        if(!hasPermission){
            return interaction.reply({content: "You do not have permission to use this command.", ephemeral: true});
        }

		if(pageCountMax == 0){
            return interaction.reply("This user has no items in their inventory.");
        }

		for(let i = 0; i < pageCountMax; i++){
			const embed = new EmbedBuilder()
			.setColor([68, 41, 37])
			.setTitle('User inventory:')
			.setAuthor({name:interaction.options.getUser('user-tag').username, iconURL:interaction.options.getUser("user-tag").avatarURL()})
				.setDescription('Here is a list of all the items this player owns.')
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
	} // end of execute
};