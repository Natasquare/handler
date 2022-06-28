const {sync} = require('glob'),
    {Collection} = require('discord.js');

module.exports = class Handler {
    /**
     * @param {Client} client Your Discord.js client.
     */
    constructor(client) {
        client.commands = new Collection();
        this.client = client;
    }
    /**
     * @param {String} [cpath] The glob pattern of the directory containing the commands.
     * @param {String} [epath] The glob pattern of the directory containing the events.
     * @param {Boolean} [string=false] Whether the output should be a string.
     * @returns {Handler | String} The handler itself or the logs.
     */
    load(cpath, epath, string = false) {
        !string && console.clear();
        let start = Date.now(),
            res = [],
            l = string ? [].push.bind(res) : console.log;
        l('Loading commands...');
        cpath && sync(cpath).map((path) => {
            l(`|  Walking in ${path}`);
            try {
                delete require.cache[require.resolve(path)];
                const file = require(path),
                    directory = path.split('/').slice(-2, -1)[0];
                [].concat(file).forEach(() => {
                    this.client.commands.set(file.name, {directory, ...file});
                    l(`|  Command ${file.name} has been loaded`);
                });
            } catch (err) {
                l(`|  ${'Failed to load the command above:'}`, err.message);
            }
        });
        l(`Loaded ${this.client.commands.size} commands in ${Date.now() - start}ms\nLoading events...`);
        start = Date.now();
        const old = Object.keys(this.client._events).length;
        epath && sync(epath).map((path) => {
            l(`|  Walking in ${path}`);
            try {
                delete require.cache[require.resolve(path)];
                const file = require(path);
                [].concat(file).forEach((event) => {
                    this.client.on(event.name, (...a) => event.execute(this.client, ...a));
                    l(`|  Event ${event.name} has been loaded`);
                });
            } catch (err) {
                l(`|  ${'Failed to load the event above:'}`, err.message);
            }
        });
        l(`Loaded ${Object.keys(this.client._events).length - old} events in ${Date.now() - start}ms`);
        return string ? res.join('\n') : this;
    }
};
