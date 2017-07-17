import Commando from 'discord.js-commando';
import Issue from '../classes/issue';

export default class NewIssue extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'new-issue',
            group: 'agile',
            memberName: 'new-issue',
            description: 'Add an issue to the issue board.',
            details: '!new-issue SmellyRick Rick really smells',
            args: [
                {
                    key: 'title',
                    label: 'title',
                    prompt: 'What do you want to title your issue?',
                    type: 'string'
                },
                {
                    key: 'problem',
                    label: 'problem',
                    prompt: 'What exactly is your issue?',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args) {
        let retroManager = new RetroManager();

        if (retroManager.active) {
            message.channel.send('You cannot add issues during a Retrospective.');
            return;
        }

        let issue = new Issue(args.problem, message.member.displayName, args.title);

        try {
            await issue.create();
            message.channel.send('Successfully created an issue.');
        } catch (e) {
            throw new Error(e);
        }
    }
}
