const { SlashCommandBuilder, MessageButton, MessageActionRow } = require('discord.js');
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
		const items  = await getAllItems();
		
		console.log(items);
		const pageCountMax = Math.ceil(items.docs.length / 25);
				
		for(let i = 0; i < pageCountMax; i++){
			const embed = new EmbedBuilder()
				.setColor('#0099ff')
				.setTitle('Shop')
				.setDescription('Here is a list of all the items you can buy.')
				.setTimestamp()
				.setFooter({ text:`Page ${i + 1} of ${pageCountMax.toString()}`});
			embeds.push(embed);
		}
		
		const getRow = (id) => {
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('prev')
						.setLabel('Previous')
						.setStyle('PRIMARY')
						.setDisabled(pages[id] == 0),
					new MessageButton()
						.setCustomId('next')
						.setLabel('Next')
						.setStyle('PRIMARY')
						.setDisabled(pages[id] == pageCountMax - 1),
				);
			return row;
		}
		const id = interaction.user.id;

		pages[id] = pages[id] || 0;

		const embed = embeds[pages[id]];

		interaction.reply({ embeds: [embed], components: [getRow(id)] });

		let collector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === userID, time: 15000 });

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


        /* db.collection('items')
        .get()
        .then((QuerySnapshot) =>{
			const exampleEmbed = new EmbedBuilder()
					.setColor([68, 41, 37])
					.setTitle('Scrip Shop')
					.setAuthor({name:interaction.user.username, iconURL:interaction.user.avatarURL()})
					.setDescription(`📟 Hello, ${interaction.user.username}, here are the items available for Purchase.`)
					.setTimestamp()
					.setFooter({ text: `Use /buy and follow the instructions to buy an item. Page: of `});
            QuerySnapshot.forEach((doc) => {
                    exampleEmbed.addFields({name:doc.data().name.toString(), value: `Price: ${doc.data().price.toString()} \n In Stock: ${doc.data().quantity.toString()}`,inline:true})
            })
			interaction.reply({embeds: [exampleEmbed]})}) */
    },
};