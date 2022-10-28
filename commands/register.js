const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
import { db } from '../firebaseConfig.js'
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription("Registers you to the database if you're not already in it."),
		
	async execute(interaction) {
		const userId = interaction.user.id
		const initialBalance = 50
		db.collection("users")
		.where("discordId","==",userId)
		.get()
		.then((QuerySnapshot) =>{
			if(QuerySnapshot.empty){
				console.log(userId)
						db.collection("users").add({
							discordId: userId,
							balance: initialBalance,
							monthFromNow:"PLACEHOLDER NULL"
						})
						.then((docRef) => {
							console.log("Document written with ID: ", docRef.id);
							VerificationString = `Registration Complete; Welcome ${interaction.user.username}.`
							interaction.reply(VerificationString)
						})
						.catch((error) => {
							console.error("Error adding document: ", error);
						});				
			}
			else{
				QuerySnapshot.forEach((doc) => {
					if(doc.data().discordId == userId){
						VerificationString = "You already exist in our database."
					}
					interaction.reply(VerificationString);})
			}
			
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		});
	},
};
