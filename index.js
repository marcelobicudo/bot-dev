import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import helpMessage from './resources/helpMessage.js';

dotenv.config();

const token = process.env.BOT_TOKEN;
const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const prefix = process.env.PREFIX;

try {
    const discordClient = new Client({ intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]});
    
    discordClient.on('ready', () => {
        console.log('pica pal ta na área');
    });
    
    discordClient.on('messageCreate', message => {
        if (message.channelId !== channelId && message.guildId === guildId) {
            return console.log('Ops, canal errado');
        }

        if (message.author.bot) {
            return console.log('Ops, mensagem do bot num vale');
        }

        if (message.content === 'zas') {
            message.reply('BLZZ');
        }

        if (message.content === 'soj') {
            message.reply('jos');
        }

        if (message.content.startsWith(prefix)) {
            const content = message.content.slice(prefix.length);

            switch (content) {
                case 'help':
                    message.reply(helpMessage());
                    break;

                case 'github':
                    message.reply('https://github.com/marcelobicudo/bot-dev');
                    break;

                default:
                    message.reply('Não consigo ler nada');
                    break;
            }
        }
    });

    discordClient.login(token);
} catch (error) {
    console.error('erro', error);
}