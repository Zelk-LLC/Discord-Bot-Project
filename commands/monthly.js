const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monthly')
		.setDescription("Pay a specified Amount to user monthly."),
		
	async execute(interaction) {
        const CurrentTime = new Date();
        const MonthFromNow = new Date(CurrentTime);
        console.log(interaction.member.roles.cache.at(1).id)
        MonthFromNow.setMonth(MonthFromNow.getMonth() + 1)
        db.collection('users')
        .where('discordId' ,'==',interaction.user.id)
        .get()
        .then((QuerySnapshot) =>{
            if(QuerySnapshot.empty){
                interaction.reply("You do not exist in our Database.")
            }else{
                db.collection("users")
                .where("discordId","==",interaction.user.id)
                .get()
                .then((QuerySnapshot) =>{
                    QuerySnapshot.forEach((doc) =>{
                        var dbDate = new Date(doc.data().monthFromNow)
                        
                        console.log(dbDate)
                        if(dbDate - CurrentTime > 0){
                            interaction.reply(`${interaction.user.username} you've already used this command this month.`)
                        }
                        else{
                            db.collection('users')
                            .doc(doc.id)
                            .update({
                                balance: doc.data().balance + 1000,
                                monthFromNow: MonthFromNow.toString()
                            }).then(() =>{
                                interaction.reply(`You've recieved a total of 1000 Scrip as your monthly payment.`)
                            })
                        }
                    })
                })
            }
        })
    }
}