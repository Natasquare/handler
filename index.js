const {Client} = require('discord.js'),
    Handler = require('./handler'),
    client = new Client(require('./options'));
client.config = require('./config.js');
client.handler = new Handler(client).load('./commands/**/*.js', './events/**/*.js');
// client.handler = new Handler(client).load(client.config.paths.commands, client.config.paths.events);
client.login(client.config.token);

/*
the Handler#load method can also be used as a reload function
eg. client.handler.load('abc', undefined, true);
this will reload commands and return a string output
*/