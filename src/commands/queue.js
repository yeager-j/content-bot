import Commando from 'discord.js-commando';
import MusicManager from '../modules/music-manager';

export default class Queue extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            description: 'Shows the song queue.',
            details: ''
        })
    }

    async run(message, args) {
        let manager = new MusicManager();
        message.channel.send('', {
            "embed": {
                "title": "Music Queue",
                "fields": (() => {
                    let fields = [];

                    manager.queue.forEach(song => {
                        fields.push({
                            "name": song.title,
                            "value": `Requested By: ${song.requestedBy}`
                        })
                    });

                    return fields;
                })()
            }
        })
    }
}