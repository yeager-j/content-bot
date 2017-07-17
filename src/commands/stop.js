import Commando from 'discord.js-commando';
import MusicManager from '../modules/music-manager';

export default class Stop extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            group: 'music',
            memberName: 'stop',
            description: 'Stops the music',
            details: ''
        })
    }

    async run(message, args) {
        let manager = new MusicManager();
        manager.stop();
    }
}