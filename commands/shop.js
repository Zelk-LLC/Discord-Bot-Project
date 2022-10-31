const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Provides you with a list of purchaseable items.'),
		
	async execute(interaction) {
        db.collection('items')
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
			interaction.reply({embeds: [exampleEmbed]})})
    },
};