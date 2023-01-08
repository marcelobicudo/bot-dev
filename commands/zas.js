import { SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('zas')
        .setDescription('Reply with blzz'),
    async execute(interaction) {
        await interaction.reply('BLZZ');
    },    
}