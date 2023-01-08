import dotenv from 'dotenv';
dotenv.config();

const prefix = process.env.PREFIX;
const separator = `:arrow_right_hook:`;
const messages = [
    `\`\`\`${prefix}help\`\`\`  ${separator} exibe os comandos disponíveis do bot`,
    `\`\`\`${prefix}github\`\`\`  ${separator} exibe o repositório do código fonte do bot`,
    `\`\`\`zas\`\`\` ${separator} blz`,
    `\`\`\`soj\`\`\` ${separator} jos`
]

export default helpMessage => {
    return messages.join('');
}