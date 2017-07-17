import Commando from 'discord.js-commando';
import * as fs from 'fs';

export default class PrequelMemes extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'prequel',
            group: 'fun',
            memberName: 'prequel',
            description: 'Posts a Star Wars prequel meme of your choosing.',
            details: '!prequel ' + (() => {
                let str = '';
                let images = fs.readdirSync('./public/images');
                images.forEach(image => {
                    str += `[${image.split('.')[0]}] `
                });

                return str;
            })(),
            args: [
                {
                    key: 'meme',
                    label: 'meme',
                    prompt: 'What are your orders, Master Jedi?',
                    type: 'string',
                    validate: (value, msg, arg) => {
                        if (/[^a-zA-Z0-9-]/.test(value)) {
                            return false;
                        }

                        let files = fs.readdirSync('./public/images').map(file => file.split('.')[0]);
                        return files.indexOf(value) > -1;
                    }
                }
            ]
        })
    }

    async run(message, args) {
        let memes = {};

        try {
            let images = fs.readdirSync('./public/images');
            images.forEach(image => {
                memes[image.split('.')[0]] = `./public/images/${image}`;
            });

            if (memes[args.meme]) {
                message.channel.send('', {
                    file: memes[args.meme]
                });
            } else {
                message.channel.send('Can\'t find that meme, sorry fam.');
            }
        } catch (e) {
            console.log(e);
            message.channel.send('Error fetching that meme. Sorry, buddy.');
        }
    }
}