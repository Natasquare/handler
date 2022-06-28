module.exports = {
    name: 'messageCreate',
    /**
     * @param {Client} client The bot client.
     * @param {Message} message messageCreate event parameter.
     * @returns {undefined} Nothing.
     */
    execute: async (client, message) => {
        const prefix = [].concat(client.config.prefix).map((x) => x.toLowerCase());
        if (message.author.bot || !prefix.some((x) => message.content.toLowerCase().startsWith(x))) return;
        const [cmd, ...args] = message.content
                .slice(prefix.reduce((a, b) => (message.content.startsWith(b) && b.length > a.length ? b : a), '').length)
                .trim()
                .split(' '),
            command = client.commands.get(cmd.toLowerCase()) || client.commands.find((c) => [].concat(c.aliases).includes(cmd.toLowerCase()));
        if (!command) return;
        if (command.ownerOnly && ![].concat(client.config.owner).includes(message.author.id)) return message.channel.send('This is an owner-only command.');
        if (command.permissions && !message.member.permissions.has(command.permissions)) return message.channel.send('You do not have the required permissions: ' + [].concat(command.permissions).join(', '));
        try {
            await command.run(client, message, args);
        } catch (error) {
            console.error(error);
            message.channel.send(error.message).catch(() => {});
        }
    }
};