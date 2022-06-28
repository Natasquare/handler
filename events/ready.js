module.exports = {
    name: 'ready',
    /**
     * @param {Client} client The bot client.
     * @returns {undefined} Nothing.
     */
    execute: async (client) => {
        console.log(`Logged in as ${client.user.tag}!`);
    }
}
