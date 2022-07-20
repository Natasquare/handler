module.exports = {
    name: 'interactionCreate',
    execute: async (client, interaction) => {
        if (interaction.isCommand()) {
            const cmd = client.commands.filter((cmd) => cmd.slash).get(interaction.commandName);
            if (!cmd)
                return interaction.reply({
                    content: 'Something went wrong...',
                    ephemeral: true
                });
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);
            cmd.run(
                client,
                interaction,
                (interaction.options.data[0]?.type === 'SUB_COMMAND'
                    ? interaction.options.data[0].options.concat({name: 'CMD', value: interaction.options.data[0].name})
                    : interaction.options.data
                ).reduce((a, {name, value, attachment, user}) => ((a[name] = user || attachment || value), a), {})
            );
        }
        if (interaction.isContextMenu()) {
            const command = client.commands.filter((cmd) => cmd.contextMenu).get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    }
};
