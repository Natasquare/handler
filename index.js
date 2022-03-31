const { Client, Collection } = require('discord.js');
const client = new Client(require('./options.js'));
client.commands = new Collection();
client.cd = new Collection();
client.config = require('./config.js');
require('./handler.js')(client);
client.login(client.config.token);
