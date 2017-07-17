import Commando from 'discord.js-commando';
import MusicManager from '../modules/music-manager';

export default class Skip extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: 'Skips a song',
            details: ''
        })
    }

    async run(message, args) {
        let manager = new MusicManager();
        manager.skip();
    }
}