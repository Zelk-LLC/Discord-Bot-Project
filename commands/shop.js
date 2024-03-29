const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getAllItems } = require('../Data/FirebaseContext.js');
const buttonPages = require('../Models/pagination.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Provides you with a list of purchaseable items.'),
		
	async execute(interaction) {
		const embeds = [];
		const items = await getAllItems();
		const pageCountMax = Math.ceil(items.docs.length / 25);
				
		for(let i = 0; i < pageCountMax; i++){
			const embed = new EmbedBuilder()
				.setColor('#0099ff')
				.setTitle('Shop')
				.setDescription('Here is a list of all the items you can buy.')
				.setTimestamp()
				.setFooter({ text:`Page ${i + 1} of ${pageCountMax.toString()}`});
			const fields = [];
			for(let j = 0; j < 25; j++){
				if(items.docs[i * 25 + j] == undefined){
					break;
				}
				fields.push({name: items.docs[i * 25 + j].data().name, value: `Price: ${items.docs[i * 25 + j].data().price} Scrip ${items.docs[i * 25 + j].data().quantity > 0 ? `(${items.docs[i * 25 + j].data().quantity} left)` : '(Out of stock)'}`});
			}	
			
			embed.addFields(fields);
			embeds.push(embed);
		}
		buttonPages(interaction, embeds);
    }
};