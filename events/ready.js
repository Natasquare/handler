module.exports = {
    name: 'ready',
    /**
     * @param {Client} client The bot client.
     * @returns {undefined} Nothing.
     */
    execute: async (client) => {
        await client.application.commands.set(client.commands.filter((cmd) => cmd.slash || cmd.contextMenu).map((cmd) => cmd.data.toJSON()));
        console.log(`Logged in as ${client.user.tag}!`);
    }
};
