import Commando from 'discord.js-commando';
import request from 'request-promise';
import * as https from 'https';
import * as http from 'http';
import * as secret from '../../secret.json';

export default class Reddit extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'fun',
            memberName: 'reddit',
            description: 'Get a random hot post from a chosen Subreddit.',
            details: '!reddit earthporn',
            args: [
                {
                    key: 'subreddit',
                    label: 'subreddit',
                    prompt: 'Choose a Subreddit.',
                    type: 'string',
                    validate: (value, msg, arg) => {
                        return !/[^a-zA-Z0-9_]/.test(value);
                    }
                }
            ],
            throttling: {
                usages: 1,
                duration: 5
            }
        })
    }

    async run(message, args) {
        let subreddit;

        message.channel.send(`Searching for /r/${args.subreddit}`);

        try {
            subreddit = this.validateSubreddit(JSON.parse(await request.get(`https://www.reddit.com/r/${args.subreddit}/hot/.json?count=30`)), message);

            if (!subreddit) {
                return;
            }
        } catch (e) {
            if (e.statusCode === 403) {
                message.channel.send('You cannot view that subreddit.');
                return;
            }

            if (e.statusCode === 404) {
                message.channel.send('That subreddit does not exist.');
                return;
            }

            throw new Error('Unexpected Error');
        }

        let post = subreddit.data.children[Math.floor(Math.random() * subreddit.data.children.length)];
        let imgurAlbum;
        let imgurPost;
        let postType = await this.getPostType(post);

        switch (postType) {
            case 'image':
                message.channel.send('', {
                    "embed": {
                        "title": post.data.title,
                        "description": post.data.author,
                        "color": 11551476,
                        "image": {
                            "url": post.data.url
                        },
                        "author": {
                            "name": message.author.username,
                            "icon_url": message.author.avatarURL
                        }
                    }
                });
                break;
            case 'imgur-album':
                imgurAlbum = await this.getImageFromImgurAlbum(post);

                if (!imgurAlbum) {
                    message.channel.send('That album does not exist!');
                    return;
                }

                message.channel.send('', {
                    "embed": {
                        "title": post.data.title,
                        "description": post.data.author,
                        "color": 11475996,
                        "image": {
                            "url": imgurAlbum
                        },
                        "author": {
                            "name": message.author.username,
                            "icon_url": message.author.avatarURL
                        }
                    }
                });
                break;
            case 'imgur':
                imgurPost = await this.getImageFromImgurLink(post);

                if (!imgurPost) {
                    message.channel.send('That image does not exist!');
                    return;
                }

                message.channel.send('', {
                    "embed": {
                        "title": post.data.title,
                        "description": post.data.author,
                        "color": 11475996,
                        "image": {
                            "url": imgurPost
                        },
                        "author": {
                            "name": message.author.username,
                            "icon_url": message.author.avatarURL
                        }
                    }
                });
                break;
            case 'self-text':
                if (post.data.selftext.length > 1024) {
                    message.channel.send(`That post was too long for Discord. Here's the Permalink: ${post.data.permalink}`);
                } else {
                    message.channel.send('', {
                        embed: {
                            "title": post.data.title,
                            "description": post.data.author,
                            "color": 2993948,
                            "fields": [
                                {
                                    "name": "selftext",
                                    "value": post.data.selftext
                                }
                            ]
                        }
                    });
                }
                break;
            case 'link':
                message.channel.send('', {
                    embed: {
                        "title": post.data.title,
                        "description": post.data.author,
                        "color": 4359924
                    }
                });

                message.channel.send(post.data.url);
                break;
            case 'missing-image':
                message.channel.send('The image link is broken. Sorry.');
                break;
            default:
                message.channel.send('Could not retrieve a post from that subreddit. Probably doesn\'t exist.');
        }
    }

    async getImageFromImgurAlbum(post) {
        let albumID = post.data.url.split('/a/')[1];
        let options = {
            url: `https://api.imgur.com/3/album/${albumID}`,
            headers: {
                'Authorization': `Client-ID ${secret.imgur.clientID}`
            }
        };

        let response;

        try {
            response = await request(options);
        } catch (e) {
            throw new Error('Cannot get Imgur album');
        }

        response = JSON.parse(response);
        return response.data.images[Math.floor(Math.random() * response.data.images.length)].link;
    }

    async getImageFromImgurLink(post) {
        let imgurID = post.data.url.split('/')[post.data.url.split('/').length - 1];
        let options = {
            url: `https://api.imgur.com/3/image/${imgurID}`,
            headers: {
                'Authorization': `Client-ID ${secret.imgur.clientID}`
            }
        };

        let response;

        try {
            response = await request(options);
        } catch (e) {
            throw new Error('Cannot get Imgur link');
        }

        response = JSON.parse(response);
        return response.data.link;
    }

    async getPostType(post) {
        let isImage;

        try {
            isImage = await this.isImage(post);
        } catch (e) {
            throw new Error('Cannot determine if link is an image.');
        }

        if (isImage) {
            if (isImage === 404) {
                return 'missing-image';
            }

            return 'image';
        } else if (this.isImgurAlbum(post)) {
            return 'imgur-album';
        } else if (this.isImgurPost(post)) {
            return 'imgur';
        } else if (this.isSelftext(post)) {
            return 'self-text';
        } else if (this.isLink(post)) {
            return 'link';
        }
    }

    async isImage(post) {
        return new Promise((resolve, reject) => {
            let protocol = (post.data.url.split('://')[0] === 'http' ? http : https);

            protocol.get(post.data.url, (response) => {
                if (!response.headers['content-type']) {
                    resolve(404);
                    return;
                }

                resolve(response.headers['content-type'].split('/')[0] === 'image')
            }).on('error', error => {
                resolve(404);
            })
        });
    }

    isImgurAlbum(post) {
        return post.data.url.includes('imgur.com/a/') || post.data.url.includes('imgur.com/gallery/');
    }

    isImgurPost(post) {
        return post.data.url.includes('imgur.com/');
    }

    isSelftext(post) {
        return post.data.is_self;
    }

    isLink(post) {
        return post.data.url !== '';
    }

    validateSubreddit(subreddit, message) {
        if (subreddit.reason === 'private') {
            message.channel.send('That subreddit is private.');
            return false;
        }

        if (subreddit.message === 'Forbidden') {
            message.channel.send('You cannot view this subreddit.');
            return false;
        }

        if (subreddit.data.children.length === 0) {
            message.channel.send('That subreddit does not exist.');
            return false;
        }

        return subreddit;
    }
}