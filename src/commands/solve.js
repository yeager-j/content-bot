import Commando from 'discord.js-commando';
import Issue from '../classes/issue';
import RetroManager from '../modules/retrospective-manager';

export default class Solve extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'solve',
            group: 'agile',
            memberName: 'solve',
            description: 'Adds a solve to the issue at hand.',
            details: '!solve Make Rick take a bath',
            args: [
                {
                    key: 'solve',
                    label: 'solve',
                    prompt: 'What is the solution to the issue?',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.member.roles.find('name', 'SCRUM Master');
    }

    async run(message, args) {
        let issue;
        let retroManager = new RetroManager();

        if (!retroManager.active) {
            message.channel.send('Retrospective Mode isn\'t active.');
            return;
        }

        try {
            issue = await Issue.get(retroManager.currentIssue.id);
            console.log(issue);
        } catch (e) {
            throw new Error('Could not get issue.');
        }

        issue.solve = args.solve;

        try {
            await issue.update();
        } catch (e) {
            throw new Error('Could not save issue.');
        }

        message.channel.send('Successfully updated the issue.');
        retroManager.issueList.shift();
        await retroManager.cycleIssue();
    }
}