import Commando from 'discord.js-commando';
import { oneLine } from 'common-tags';

export default class Foo extends Commando.Command{
    constructor(client) {
        super(client, {
            name: 'foo',
            group: 'admin',
            memberName: 'foo',
            description: 'Responds with \'Bar!\' A useful test command.',
            details: ''
        });
    }

    async run(message, args) {
        message.channel.send('Bar!');
    }
}