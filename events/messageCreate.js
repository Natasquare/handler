const client = require('../index');
const ms = require('ms');

client.on('messageCreate', async (message) => {
    if (
        message.author.bot ||
        !message.guild ||
        !client.config.prefix.reduce((a, b) => (a = a || message.content.toLowerCase().startsWith(b)), false)
    )
        return;

    const [cmd, ...args] = message.content
        .slice(
            client.config.prefix
                .filter((x) => message.content.toLowerCase().startsWith(x))
                .reduce((a, b) => (b.length > a.length ? b : a), '').length
        )
        .trim()
        .split(/ +/g);

    const command =
        client.commands.get(cmd.toLowerCase()) ||
        client.commands.find((c) =>
            (Array.isArray(c.aliases) ? c.aliases : [c.aliases])?.includes(
                cmd.toLowerCase()
            )
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