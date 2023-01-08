import dotenv from 'dotenv';
import path, { dirname } from 'path';
import fs from 'fs';
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import command from './commands/zas.js'

dotenv.config();
const __dirname = dirname('');

try {
    const discordClient = new Client({ intents: [GatewayIntentBits.Guilds]});

    discordClient.commands = new Collection();
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        
        discordClient.commands.set(command.data.name, command);
    }

    discordClient.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    discordClient.on(Events.InteractionCreate, async interaction => {
        console.log('aqui')
        if (!interaction.isChatInputCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });

    discordClient.login(process.env.BOT_TOKEN);
} catch(error) {
    console.error('erro', error);
}