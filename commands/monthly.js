const { SlashCommandBuilder } = require('discord.js');
const {db} = require('../firebaseConfig.js')
const { EmbedBuilder } = require('discord.js');
const { getUser, updateBalance, getMonthlyRate } = require('../Data/FirebaseContext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monthly')
		.setDescription("Pay a specified amount to user monthly."),
		
	async execute(interaction) {
        const CurrentTime = new Date();
        const MonthFromNow = new Date(CurrentTime);
        var monthly = await getMonthlyRate(interaction) ?? 0;
        MonthFromNow.setMonth(MonthFromNow.getMonth() + 1)

        const user = await getUser(interaction.user.id);
        if(user == undefined){
            return interaction.reply("You don't have an account. Please use /register to create one.");
        }
        else {
            //if CurrentTime is more than a month from now then update the balance and set the next payment date to a month from now.
            if(CurrentTime < new Date(user.docs[0].data().monthFromNow)){
                return interaction.reply(`You have already been given your monthly scrip.`);
            }
            else {
                await updateBalance(interaction.user.id, monthly);
                await db.collection('users').doc(user.docs[0].id).update({monthFromNow: MonthFromNow.toString()});
                return interaction.reply(`You have been paid ${monthly} scrip.`);
            }
        }
    }
}