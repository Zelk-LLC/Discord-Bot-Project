const { SlashCommandBuilder, PermissionsBitField,PermissionFlagsBits } = require('discord.js');
const {db} = require('../firebaseConfig.js')
 
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-user')
		.setDescription("Adds a user to the database if they don't already exist within it")
		.addUserOption(option =>
			option.setName("user-tag")
			.setDescription("User's @")
			.setRequired(true))
			.addIntegerOption(option =>
				option.setName("initial-bal-int")
			.setDescription("User's initial balance.")
			.setRequired(true))
			.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
		
	async execute(interaction) {
		const userId = interaction.options.getUser("user-tag").id;
		const initialBalance = interaction.options.getInteger("initial-bal-int")
		db.collection("users")
		.where("discordId","==",userId)
		.get()
		.then((QuerySnapshot) =>{
			if(QuerySnapshot.empty){
				console.log(userId)
						db.collection("users").add({
							discordId: userId,
							balance: initialBalance
						})
						.then((docRef) => {
							console.log("Document written with ID: ", docRef.id);
							VerificationString = "User added Successfully."
							interaction.reply(VerificationString)
						})
						.catch((error) => {
							console.error("Error adding document: ", error);
						});				
			}
			else{
				QuerySnapshot.forEach((doc) => {
					if(doc.data().discordId == userId){
						VerificationString = "User already exists in the database."
					}
					interaction.reply(VerificationString);})
			}
			
		}).catch((error) => {
			console.log("Error getting documents: ", error);
		});
	},
};


	
