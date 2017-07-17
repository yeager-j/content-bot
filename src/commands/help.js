import Commando from 'discord.js-commando';

export default class Help extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'general',
            memberName: 'help',
            description: 'Shows information about commands.',
            args: [
                {
                    key: 'command',
                    label: 'command',
                    prompt: 'What command do you want to search for?',
                    type: 'string',
                    default: ''
                }
            ]
        })
    }

    async run(message, args) {
        if (args.command === '') {
            const myCommands = this.client.registry.findCommands().filter(c => c.hasPermission(message));
            let embed = {
                "title": "Command List",
                "description": "Use !help [command] for more information",
                "color": 3447003,
                "fields": (() => {
                    let fields = [];
                    let categories = [...new Set(myCommands.map(command => command.group.name))];

                    categories.forEach(category => {
                        fields.push({
                            "name": category,
                            "value": (() => {
                                let str = "";

                                myCommands.filter(c => c.group.name === category).forEach(command => {
                                    str += this.client.commandPrefix + command.name + '\n'
                                });

                                return str;
                            })(),
                            "inline": true
                        });
                    });

                    return fields;
                })()
            };

            message.channel.send('', { embed });
        } else {
            if (this.client.registry.commands.has(args.command)) {
                let command = this.client.registry.findCommands(args.command, true)[0];
                let embed = {
                    "title": this.client.commandPrefix + command.name,
                    "description": command.description + '\n\n' + `${command.details}`
                };

                message.channel.send('', { embed })
            }
        }

    }
}