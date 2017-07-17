import 'babel-polyfill';
import mochaAsPromised from 'mocha-as-promised';
import chaiAsPromised from 'chai-as-promised';
import Commando from 'discord.js-commando';
import Reddit from '../../src/commands/reddit';
import * as path from 'path';
import * as http from 'http';
import * as chai from 'chai';

mochaAsPromised();
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Reddit command', () => {
    let client;
    let reddit;

    beforeEach(() => {
        client = new Commando.Client({
            owner: '223596463777775617'
        });

        client.registry.registerDefaults();
        reddit = new Reddit(client);
    });

    describe('getImageFromImgurAlbum()', () => {
        let post;

        beforeEach(() => {
            post = {
                data: {
                    url: 'http://imgur.com/a/vyQte'
                }
            };
        });

        it('should be defined', () => {
            expect(reddit.getImageFromImgurAlbum).to.exist;
        });

        it('should not return null', () => {
            return expect(reddit.getImageFromImgurAlbum(post)).to.eventually.not.equal(null);
        });

        it('should return an image', () => {
            return expect(reddit.getImageFromImgurAlbum(post)).to.eventually.satisfy(image => {
                let extension = image.split('.')[image.split('.').length - 1];

                return extension === 'png' || extension === 'jpg' || extension === 'gif';
            });
        });

        it('should throw an error when passed an invalid imgur link', () => {
            post = {
                data: {
                    url: 'http://imgur.com/a/weoirufhiu'
                }
            };

            return expect(reddit.getImageFromImgurAlbum(post)).to.eventually.be.rejectedWith('Cannot get Imgur album');
        });
    });

    describe('getImageFromImgurLink()', () => {
        let post;

        beforeEach(() => {
            post = {
                data: {
                    url: 'https://imgur.com/3l5FkKs'
                }
            };
        });

        it('should be defined', () => {
            expect(reddit.getImageFromImgurLink).to.exist;
        });

        it('should not return null', () => {
            return expect(reddit.getImageFromImgurLink(post)).to.eventually.not.equal(null);
        });

        it('should return an image', () => {
            return expect(reddit.getImageFromImgurLink(post)).to.eventually.satisfy(image => {
                let extension = image.split('.')[image.split('.').length - 1];

                return extension === 'png' || extension === 'jpg' || extension === 'gif';
            });
        });

        it('should throw an error when passed an invalid imgur link', () => {
            post = {
                data: {
                    url: 'http://imgur.com/a/weoirufhiu'
                }
            };

            return expect(reddit.getImageFromImgurLink(post)).to.eventually.be.rejectedWith('Cannot get Imgur link');
        });
    });

    describe('getPostType()', () => {
        it('should be defined', () => {
            expect(reddit.getPostType).to.exist;
        });

        it('should return "image"', () => {
            let post = {
                data: {
                    url: 'https://i.imgur.com/3l5FkKs.jpg'
                }
            };

            return expect(reddit.getPostType(post)).to.eventually.equal('image');
        });

        it('should return "imgur-album"', () => {
            let post = {
                data: {
                    url: 'https://imgur.com/a/uAFvn'
                }
            };

            return expect(reddit.getPostType(post)).to.eventually.equal('imgur-album');
        });

        it('should return "imgur"', () => {
            let post = {
                data: {
                    url: 'https://imgur.com/3l5FkKs'
                }
            };

            return expect(reddit.getPostType(post)).to.eventually.equal('imgur');
        });

        it('should return "self-text"', () => {
            let post = {
                data: {
                    url: 'https://www.reddit.com/r/darksouls3/comments/6l7lvw/pc_community_fight_club_event/',
                    is_self: true
                }
            };

            return expect(reddit.getPostType(post)).to.eventually.equal('self-text');
        });

        it('should return "link"', () => {
            let post = {
                data: {
                    url: 'https://www.reddit.com/r/darksouls3/comments/6l7lvw/pc_community_fight_club_event/'
                }
            };

            return expect(reddit.getPostType(post)).to.eventually.equal('link');
        });

        it('should return "missing-image"', () => {
            let post = {
                data: {
                    url: 'http://wieriuwergwr.com'
                }
            };

            return expect(reddit.getPostType(post)).to.eventually.equal('missing-image');
        });
    });
});