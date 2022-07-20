module.exports = {
    name: 'ping',
    aliases: 'pong',
    run: async (client, message) => {
        message.reply(`Pong! ${client.ws.ping}ms`);
    }
};
