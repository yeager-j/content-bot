import Retro from '../classes/retrospective';
import Issue from '../classes/issue';

let instance = null;

export default class RetrospectiveManager {
    constructor(channel = instance.channel) {
        if (!instance) {
            console.log('creating new instance');
            instance = this;
        }

        this.active = instance.active || false;
        this.issueList = instance.issueList || [];
        this.currentIssue = instance.currentIssue || null;
        this.currentRetro = instance.currentRetro || null;
        this.timeout = null;
        this.channel = channel;

        return instance;
    }

    async start() {
        this.currentRetro = await Retro.get();
        this.issueList = await Issue.getAll();
        this.active = true;

        await this.cycleIssue();
    }

    async end() {
        this.currentRetro.end_date = Date.now();
        this.currentRetro.current = false;
        await this.currentRetro.update();

        let newRetro = new Retro();
        newRetro.current = true;
        await newRetro.create();

        this.channel.send('This week\'s retrospective has ended. Creating a new one for next week.');
    }

    async cycleIssue() {
        if (this.issueList.length === 0) {
            this.channel.send('The issue list is empty! Thank you all for participating.');
            clearTimeout(instance.timeout);

            let issueList;

            try {
                issueList = await Issue.getAll();

                let embed = {
                    "title": "This Week's Retrospective",
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

                this.channel.send('', {
                    embed
                })
            } catch (e) {
                throw new Error('Could not get all issues.');
            }

            this.active = false;
            await this.end();
            return;
        }

        this.currentIssue = this.issueList[0];
        this.channel.send('Here is your next issue:');
        this.channel.send('', {
            "embed": {
                "title": `Title: ${this.currentIssue.title} | Author: ${this.currentIssue.author}`,
                "description": this.currentIssue.problem
            }
        });

        if (!this.currentIssue.unsolved) {
            this.channel.send('You have 15 minutes to add a solve before we move on.');
        }

        if (instance.timeout) {
            clearTimeout(instance.timeout);
        }

        if (!this.currentIssue.unsolved) {
            instance.timeout = setTimeout(() => {
                this.channel.send('15 minutes are up! Moving on to the next issue. You can come back to this one at the end.');
                let unsolved = this.issueList.shift();
                unsolved.unsolved = true;
                this.issueList.push(unsolved);
                this.cycleIssue();
            }, 20000);
        }
    }
}