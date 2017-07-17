import Commando from 'discord.js-commando';
import Issue from '../classes/issue';

export default class ListIssues extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'list-issues',
            group: 'agile',
            memberName: 'list-issues',
            description: 'Lists the issues belonging to the current Retrospective.',
            details: ''
        })
    }

    // hasPermission(msg) {
    //     return msg.member.roles.find('name', 'Heir of Fire');
    // }

    async run(message, args) {
        let issueList;

        try {
            issueList = await Issue.getAll();

            let embed = {
                "title": "Issue List",
                "author": {
                    "name": message.author.username,
                    "icon_url": message.author.avatarURL
                },
                "fields": (() => {
                    return issueList.map(issue => {
                        issue.solve = issue.solve || "None yet.";

                        return {
                            name: `Title: ${issue.title} | Author: ${issue.author}`,
                            value: `
                                --------------------------\n**Problem**: ${issue.problem} \n \n**Solve**: ${issue.solve}\n--------------------------
                            `
                        }
                    })
                })()
            };

            message.channel.send('', {
                embed
            })
        } catch (e) {
            throw new Error('Could not get all issues.');
        }
    }
}