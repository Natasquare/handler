const {SlashCommandBuilder} = require('@discordjs/builders'),
    data = new SlashCommandBuilder().setName('pong').setDescription("Show the bot's latency");

module.exports = {
    slash: true,
    data,
    run: async (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
};
