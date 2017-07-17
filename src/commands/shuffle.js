import Commando from 'discord.js-commando';
import MusicManager from "../modules/music-manager";

export default class Shuffle extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'shuffle',
            group: 'music',
            memberName: 'shuffle',
            description: 'Shuffles the queue'
        })
    }

    async run(message, args) {
        let manager = new MusicManager();
        await manager.shuffle();
    }
}