const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription("Pay a given Ammount to user from your own wallet.")
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
			.addIntegerOption(option =>
				option.setName("ammount")
				.setDescription("ammount")
				.setMinValue(1)
				.setRequired(true)),
				
		
	async execute(interaction) {
		const userId = interaction.options.getUser("user-tag").id;
		const ammount = interaction.options.getInteger("ammount")
		db.collection('users')
		.where("discordId","==", interaction.user.id)
		.get()
		.then((QuerySnapshot)=>{
			if(QuerySnapshot.empty){
				interaction.reply("You do not exist in the database.")
			}else{
				db.collection('users')
				.where('discordId',"==",interaction.user.id)
				.get()
				.then((QuerySnapshot)=>{
					QuerySnapshot.forEach((doc)=>{
						if(doc.data().balance < ammount){
							interaction.reply("You do not have enough Scrip to conduct this transaction.")
						}
						else{
							db.collection("users")
		.where("discordId","==",userId)
		.get()
		.then((QuerySnapshot) =>{
			if(QuerySnapshot.empty){
				interaction.reply("That user does not exist in our database.")
			}
			else{
				QuerySnapshot.forEach((doc) => {
                    db.collection("users")
                    .doc(doc.id)
                    .update({
                        balance: doc.data().balance + ammount
                    }).then(() => {
                        db.collection('users')
                        .where("discordId","==",interaction.user.id)
                        .get()
                        .then((QuerySnapshot) =>{
                            QuerySnapshot.forEach((doc) => {
                                db.collection("users")
                                .doc(doc.id)
                                .update({
                                    balance: doc.data().balance - ammount
                                })
                            })
                        }).catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                        VerificationString = `User ${interaction.options.getUser('user-tag').username} has been paid ${ammount} Scrip.`
                        interaction.reply(VerificationString)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });	
                })
			}
			
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		});
						}
					})
				})
			}
		})
	},
};