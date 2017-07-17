# Contributing
Please read this guide in full if you want to contribute.

## Requirements
- Babel
- Gulp
- Mocha

## Commands

Here is a basic Command template:

```javascript
import Commando from 'discord.js-commando';
import { oneLine } from 'common-tags';

export default class Foo extends Commando.Command{
    constructor(client) {
        super(client, {
            name: 'foo',
            group: 'admin',
            memberName: 'foo',
            description: 'Responds with \'Bar!\' A useful test command.',
        });
    }
    
    // To add custom permissions to this command, override hasPermission()
    
    hasPermission(msg) {
        return msg.member.roles.find('name', 'Administrator');
    }

    async run(message, args) {
        message.channel.send('Bar!');
    }
}
```

Example command using arguments:

```javascript
import Commando from 'discord.js-commando';
import { oneLine } from 'common-tags';

export default class Say extends Commando.Command{
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'admin',
            memberName: 'say',
            description: 'Repeats your message back to you.',
            args: [
                {
                    tag: 'phrase',
                    label: 'phrase',
                    prompt: 'What would you like me to say?',
                    infinite: true,
                    type: 'string'
                }
            ]
        });
    }

    async run(message, args) {
        message.channel.send(args.phrase);
    }
}
```