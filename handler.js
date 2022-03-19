const { glob } = require('glob');
const { promisify } = require('util');
const sync = promisify(glob);
require('colors');
const b = '|---------------------------------------------------------------|';
const s = (n, v) => ' '.repeat(n - v.length);

module.exports = async (client) => {
    const start = Date.now();
    const commandFiles = await sync(`./commands/**/*.js`);
    commandFiles.map((value) => {
        console.log(b);
        console.log(`|  Walking in ${value.underline}${s(50, value)}|`);

        try {
            const file = require(value);
            const splitted = value.split('/');
            const directory = splitted[splitted.length - 2];

            if (file.name) {
                const properties = { directory, ...file };
                client.commands.set(file.name, properties);
                console.log(
                    `|  Command ${file.name.green} has been loaded${s(37, file.name)}|`
                );
            }
        } catch (err) {
            console.log(
                `|  ${'Failed to load the command above:'.red}                  |`
            );
            console.error(err);
        }
    });

    console.log(b);
    console.log(
        `Successfully loaded ${client.commands.size} commands in ${Date.now() - start}ms (${commandFiles.length - client.commands.size} failed)`
    );

    const events = await sync(`./events/*.js`);
    events.map((x) => require(x));
};
