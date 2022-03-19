module.exports = {
    name: 'ping',
    cooldown: '5s',
    aliases: 'pong',
    run: async (client, message) => {
        message.reply(`Pong! ${client.ws.ping}ms`);
    }
};