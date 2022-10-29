const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getUser, updateBalance } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monthly')
		.setDescription("Pay a specified amount to user monthly."),
		
	async execute(interaction) {
        const CurrentTime = new Date();
        const MonthFromNow = new Date(CurrentTime);
        const monthly = 1000;
        MonthFromNow.setMonth(MonthFromNow.getMonth() + 1)

        const user = await getUser(interaction.user.id);
        if(user == undefined){
            return interaction.reply("You don't have an account. Please use /register to create one.");
        }
        else {
            if(user.docs[0].data().monthFromNow == 'PLACEHOLDER NULL'){
                updateBalance(interaction.user.id, monthly);
                db.collection('users').doc(user.docs[0].id).update({
                    monthFromNow: MonthFromNow
                })
                return interaction.reply(`You have been given ${monthly} scrip for the month.`);
            }
            else {
                if(user.docs[0].data().monthFromNow < CurrentTime){
                    updateBalance(interaction.user.id, monthly);
                    db.collection('users').doc(user.docs[0].id).update({
                        monthFromNow: MonthFromNow
                    })
                    return interaction.reply(`You have been given ${monthly} scrip for the month.`);
                }
                else {
                    return interaction.reply(`You have been given ${monthly} scrip for the month.`);
                }
            }
        }
    }
}