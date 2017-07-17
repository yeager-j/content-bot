import Commando from 'discord.js-commando';
import MusicManager from '../modules/music-manager';

export default class Play extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'Plays a YouTube video in a voice channel.',
            details: '!play all star | !play https://www.youtube.com/watch?v=39VcGo0Ufc4',
            args: [
                {
                    key: 'query',
                    label: 'query',
                    prompt: 'What YouTube video do you want to play?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args) {
        let manager = new MusicManager();
        await manager.setUpVideo(message, args.query);
    }
}