import Commando from 'discord.js-commando';
import * as pkg from '../../package.json';

export default class Version extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'version',
            group: 'admin',
            memberName: 'version',
            description: 'Gets the current bot version.',
            details: ''
        })
    }

    async run(message, args) {
        message.channel.send(`v${pkg.version}`);
    }
}