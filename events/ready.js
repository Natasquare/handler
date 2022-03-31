module.exports = (client) => client.on('ready', () => {
    console.log(`Ready on ${client.user.tag}`);
});
