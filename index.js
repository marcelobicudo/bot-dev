import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import helpMessage from './resources/helpMessage.js';
import ytdl from 'ytdl-core';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

dotenv.config();

const token = process.env.BOT_TOKEN;
const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;
const prefix = process.env.PREFIX;

const queue = new Map();

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
            const content = message.content;

            const serverQueue = queue.get(message.guildId);

            if (content.startsWith(`${prefix}help`)) {
                message.reply(helpMessage());
            } else if (content.startsWith(`github`)) {
                message.reply('https://github.com/marcelobicudo/bot-dev');
            } else if (content.startsWith(`${prefix}play`)) {
                execute(message, serverQueue);
            } else if (content.startsWith(`${prefix}stop`)) {
                stop(message, serverQueue);
            } else {
                message.reply('Não consigo ler nada');
            }
        }
    });

    discordClient.login(token);
} catch (error) {
    console.error('erro', error);
}

async function execute(message, serverQueue) {
    let args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message.reply('Você precisa estar em um canal de voz pra curtir um som');
    }

    console.log('vc ', voiceChannel);
    console.log('user ', message.client.user);
    console.log('permi ', voiceChannel.permissionsFor(message.client.user))
    //return;

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.reply("Puts, não tenho permissão pra ser DJ nesse server");
    }

    let verifyArgs = args;
    verifyArgs.shift();
    if (verifyArgs.join(" ") == 'musica que nao sei o nome') {
        console.log('estou aqui')
        args[1] = 'https://www.youtube.com/watch?v=SNbURUnTYCM';
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        

        queueConstruct.songs.push(song);

        try {
            //let connection = await voiceChannel.join();
            
            let connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guildId,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            queueConstruct.connection = connection;
            queue.set(message.guildId, queueConstruct);
            play(message, queueConstruct.songs[0]);
        } catch (err) {
            console.error('erro ao executar => ', err);
            queue.delete(message.guildId)
            return message.reply('Erro ao executar');
        }
    } else {
        serverQueue.songs.push(song);
        return message.reply(`${song.title} foi adicionado na fila!`);
    }
}

function play(message, song) {
    const serverQueue = queue.get(guildId);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guildId);
        return;
    }

    console.log('server ', serverQueue.connection)
    const dispatcher = getVoiceConnection(message.member.voice.channel.guild.id).subscribe(ytdl(song.url));
        /*.on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error('Erro ao dar play => ', error));*/

    //dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Começamos a tocar: **${song.title}**`);
}

function stop(message, serverQueue) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.reply("Você tem que estar em um canal de voz pra curtir um som");
    }

    if (!serverQueue) {
        return message.reply("Uai, mas num tem nada tocando");
    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}