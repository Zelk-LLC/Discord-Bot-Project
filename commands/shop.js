const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getAllItems } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Provides you with a list of purchaseable items.'),
		
	async execute(interaction) {
		const embeds = [];
		const pages = {};
		const items = await getAllItems();
		const index = 0;
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

		interaction.reply({ embeds: [embed], components: [getRow(id)] });

		let collector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === id, time: 15000 });

		collector.on('collect', async i => {
			if(!i.isButton()) return;
			if(i.customId == 'prev' && pages[id] > 0) {
				pages[id]--;
			}
			else if(i.customId == 'next' && pages[id] < pageCountMax - 1) {
				pages[id]++;
			}
			const embed = embeds[pages[id]];
			i.update({ embeds: [embed], components: [getRow(id)] });
		});
    }
};