import Commando from 'discord.js-commando';
import RetroManager from '../modules/retrospective-manager';

export default class StartRetro extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'start-retro',
            group: 'agile',
            memberName: 'start-retro',
            description: 'Begins a retrospective.',
            details: ''
        })
    }

    hasPermission(msg) {
        return msg.member.roles.find('name', 'SCRUM Master');
    }

    async run(message, args) {
        message.channel.send('Starting the weekly retrospective.');
        let retroManager = new RetroManager(message.channel);
        await retroManager.start();
    }
}