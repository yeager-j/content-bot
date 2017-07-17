import Commando from 'discord.js-commando';

export default class HereSince extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'here-since',
            group: 'general',
            memberName: 'here-since',
            description: 'Checks how long a user has been a part of the server.',
            details: '!here-since @member',
            args: [
                {
                    key: 'member',
                    label: 'member',
                    prompt: 'Who do you want to check on?',
                    type: 'member'
                }
            ]
        })
    }

    async run(message, args) {
        message.channel.send(`${args.member.displayName} has been here since ${args.member.joinedAt}`);
    }
}