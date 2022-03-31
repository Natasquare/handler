module.exports = (client) => client.on('messageCreate', async (message) => {
    const prefix = [].concat(client.config.prefix);
    const ms = require('ms');
    
    if (
        message.author.bot ||
        !message.guild ||
        !prefix.some((x) => message.content.toLowerCase().startsWith(x))
    )
        return;

    const [cmd, ...args] = message.content
        .slice(prefix
            .filter((x) => message.content.toLowerCase().startsWith(x))
            .sort((a, b) => b.length - a.length)[0].length
        )
        .trim()
        .split(/ +/g);

    const command =
        client.commands.get(cmd.toLowerCase()) ||
        client.commands.find((c) =>
            [].concat(c.aliases).includes(cmd.toLowerCase())
        );

    if (!command) return;

    const cd = client.cd.get(`${message.author.id}_${command.name}`);
    const left = cd - Date.now();

    if (left > 0) {
        const msg = await message.channel.send(
            `You are on cooldown, please wait **${ms(left)}** to use this command again`
        );
        return setTimeout(() => msg.delete(), left);
    }

    if (command.cooldown)
        client.cd.set(
            `${message.author.id}_${command.name}`,
            Date.now() + ms(command.cooldown)
        );

    try {
        await command.run(client, message, args);
    } catch (error) {
        message.channel.send(error.toString());
    }
});
