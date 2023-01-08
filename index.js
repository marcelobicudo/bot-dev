import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;

try {
    const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    
    discordClient.on('ready', () => {
        console.log('pica pal ta na área');
    });
    
    discordClient.on('messageCreate', message => {
        if (message.content === 'zas') {
            message.reply('BLZZ')
        }
    });

    discordClient.login(token);
} catch (error) {
    console.error('erro', error);
}